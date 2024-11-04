"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Settings } from "@/types/settings";
import { genreTags } from "@/types/genretags";
import { Badge } from "@/components/ui/badge";
import { XCircle } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Loader2, Wand2 } from "lucide-react";

interface AIModel {
  id: string;
  name: string;
}

const COVER_WIDTH = 800;  // Standard book cover width
const COVER_HEIGHT = 1200; // Standard book cover height (3:2 ratio)

export default function NewProject() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>({} as Settings);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuto1111, setIsAuto1111] = useState(false);
  const [models, setModels] = useState<Array<{title: string, hash?: string}>>([]);
  const [loraModels, setLoraModels] = useState([]);
  const [model, setModel] = useState("comfyui");
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    tags: "",
    coverImage: "",
    genres: [] as string[],
    prompt: "",
    negativePrompt: "bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, artist name",
    steps: 20,
    model: "",
    lora: ""
  });

  const [progressDetails, setProgressDetails] = useState({
    progress: 0,
    currentImage: null as string | null,
    isGenerating: false,
  });

  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [modelLoadProgress, setModelLoadProgress] = useState(0);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const [aiProvider, setAiProvider] = useState<'google' | 'anthropic' | 'lmstudio'>('google');
  const [aiModel, setAiModel] = useState('');
  const [aiModels, setAiModels] = useState<Record<string, AIModel[]>>({
    google: [],
    anthropic: [],
    lmstudio: []
  });
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Get AI Models from API
  const getAiModels = async () => {
    const response = await fetch('/api/ai/generate');
    const data = await response.json();
    setAiModels(data);
  }

  const enhancePrompt = async () => {
    if (!formData.prompt) {
      toast.error('Please enter a prompt first');
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: formData.prompt,
          provider: aiProvider,
          model: aiModel,
        }),
      });

      if (!response.ok) throw new Error('Failed to enhance prompt');

      const data = await response.json();
      setFormData(prev => ({ ...prev, prompt: data.enhancedPrompt }));
      toast.success('Prompt enhanced successfully');
    } catch (error) {
      console.error('Error enhancing prompt:', error);
      toast.error('Failed to enhance prompt');
    } finally {
      setIsEnhancing(false);
    }
  };

  const enhanceDescription = async () => {
    if (!formData.description) {
      toast.error('Please enter a description first');
      return;
    }

    setIsEnhancing(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          provider: aiProvider,
          model: aiModel,
        }),
      });

      if (!response.ok) throw new Error('Failed to enhance description');

      const data = await response.json();
      setFormData(prev => ({ ...prev, description: data.enhancedDescription }));
      toast.success('Description enhanced successfully');
    } catch (error) {
      console.error('Error enhancing description:', error);
      toast.error('Failed to enhance description');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGetSettings = async () => {
    const response = await fetch('/api/settings');
    const data = await response.json();
    //console.log("Getting settings", data);
    setSettings(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(",").map(tag => tag.trim()),
          createFolders: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      router.push("/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateCover = async () => {
    setProgressDetails(prev => ({
      ...prev,
      progress: 0,
      currentImage: null,
      isGenerating: true,
    }));
    
    let progressInterval: NodeJS.Timeout | undefined = undefined;
    
    try {
      const url = `${settings.auto1111Host}:${settings.auto1111Port}/sdapi/v1/txt2img`;
      
      const promptData = {
        prompt: formData.prompt,
        negative_prompt: formData.negativePrompt,
        steps: formData.steps,
        cfg_scale: 7,
        width: COVER_WIDTH,
        height: COVER_HEIGHT,
        sampler_name: "Euler a",
        batch_size: 1,
        n_iter: 1,
        send_images: true,
        save_images: true,
      };

      console.log('Starting image generation with prompt data:', promptData);

      // Start progress monitoring
      progressInterval = setInterval(async () => {
        try {
          const progressResponse = await fetch(`${settings.auto1111Host}:${settings.auto1111Port}/sdapi/v1/progress`);
          if (!progressResponse.ok) return;
          
          const progressData = await progressResponse.json();
          
          // Batch state updates
          setProgressDetails(prev => ({
            ...prev,
            progress: Math.round((progressData.state.sampling_step / progressData.state.sampling_steps) * 100),
            currentImage: progressData.current_image,
          }));

          if (progressData.progress === 1) {
            clearInterval(progressInterval);
          }
        } catch (error) {
          console.error('Progress check error:', error);
        }
      }, 1000);

      // Generate image
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptData),
      });

      if (!response.ok) throw new Error(`Generation failed: ${response.statusText}`);

      const data = await response.json();
      if (!data.images?.length) throw new Error('No images generated');

      // Upload images
      const uploadedImages = await Promise.all(
        data.images.map(async (imageData: string, index: number) => {
          console.log(`Uploading image ${index + 1}...`);
          try {
            const uploadResponse = await fetch('/api/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                image: imageData,
                filename: `cover-${Date.now()}-${index}.png`
              })
            });
            
            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json();
              throw new Error(`Upload failed: ${errorData.error}`);
            }
            
            const uploadData = await uploadResponse.json();
            console.log(`Image ${index + 1} uploaded successfully:`, uploadData.path);
            return uploadData.path;
          } catch (error) {
            console.error(`Error uploading image ${index + 1}:`, error);
            throw error;
          }
        })
      );

      setGeneratedImages(uploadedImages);
      setFormData(prev => ({ ...prev, coverImage: uploadedImages[0] }));
    } catch (error) {
      console.error("Generation error:", error);
      toast.error(error instanceof Error ? error.message : "Generation failed");
    } finally {
      if (progressInterval) clearInterval(progressInterval);
      setProgressDetails(prev => ({
        ...prev,
        progress: 0,
        currentImage: null,
        isGenerating: false,
      }));
      return;
    }
  };

  const getModels = async () => {
    try {
      const url = `${settings.auto1111Host}:${settings.auto1111Port}/sdapi/v1/sd-models`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      setModels(data);
    } catch (error) {
      console.error("Error getting models:", error);
    }
  };

  const getLoraModels = async () => {
    try {
      const url = `${settings.auto1111Host}:${settings.auto1111Port}/sdapi/v1/loras`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setLoraModels(data);
    } catch (error) {
      console.error("Error getting lora models:", error);
    }
  }

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }))
  }

  const handleModelChange = async (value: string) => {
    setIsLoadingModel(true);
  
    try {
      // Check the current model
      const statusData = await checkCurrentModel();
  
      // Check if the current model is the same as the selected one
      if (statusData.sd_model_checkpoint === value) {
        toast.info("The selected model is already loaded.");
        setIsLoadingModel(false);
        return; // Exit early if the model is already loaded
      }
  
      // Change the model
      const response = await fetch(`${settings.auto1111Host}:${settings.auto1111Port}/sdapi/v1/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 'sd_model_checkpoint': value }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const currentModel = await checkCurrentModel();
      if (currentModel === value) {
        setFormData(prev => ({ ...prev, model: value }));
      } else {
        toast.error("Model change failed - current model does not match selected model");
      }
  
    } catch (error) {
      console.error("Error changing model:", error);
      toast.error("Failed to change model: " + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoadingModel(false);
    }
  };

  const checkCurrentModel = async () => {
    // Check current model loaded
    try {
      // Check the current model
      const statusResponse = await fetch(`${settings.auto1111Host}:${settings.auto1111Port}/sdapi/v1/options`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!statusResponse.ok) {
        throw new Error("Failed to get model status");
      }
      const statusData = await statusResponse.json();
      console.log("Current model:", statusData.sd_model_checkpoint);
      return statusData.sd_model_checkpoint;
    } catch (error) {
      console.error("Error checking current model:", error);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', `cover-${Date.now()}-upload.png`);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setGeneratedImages([data.path]);
      setFormData(prev => ({ ...prev, coverImage: data.path }));
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const clearCover = async () => {
    if (!formData.coverImage) return;

    try {
      // Delete the uploaded file
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: formData.coverImage })
      });

      if (!response.ok) throw new Error('Failed to delete image');

      // Clear the cover image from state
      setGeneratedImages([]);
      setFormData(prev => ({ ...prev, coverImage: '' }));
      toast.success('Cover image cleared');
    } catch (error) {
      console.error('Error clearing cover:', error);
      toast.error('Failed to clear cover image');
    }
  };

  useEffect(() => {
    handleGetSettings();
  }, []);

  useEffect(() => {
    if (settings.auto1111Host && settings.auto1111Port) {
      setIsAuto1111(true);
      getModels();
      getAiModels();
      getLoraModels();
      checkCurrentModel().then(model => setFormData(prev => ({ ...prev, model: model })));
    }
  }, [settings]);

  // Loading State blur
  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto p-6 opacity-50">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-6">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
            <p className="text-muted-foreground">Set up your new AI image generation project</p>
          </div>
          <Badge variant={isAuto1111 ? "default" : "destructive"} className="h-8">
            {isAuto1111 ? (
              <><CheckCircle2 className="w-4 h-4 mr-2" /> Connected to Auto1111</>
            ) : (
              <><XCircle className="w-4 h-4 mr-2" /> Not Connected to Auto1111</>
            )}
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Project Details</TabsTrigger>
            <TabsTrigger value="ai">Cover Generation</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter project name..."
                    className="max-w-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>

                  <div className="flex items-center gap-2">
                    <Select 
                      value={aiProvider} 
                      onValueChange={(value: 'google' | 'anthropic' | 'lmstudio') => {
                        setAiProvider(value);
                        setAiModel(''); // Reset model when provider changes
                      }}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="AI Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google AI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="lmstudio">LM Studio</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select 
                      value={aiModel} 
                      onValueChange={setAiModel}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {aiModels[aiProvider]?.map((model: AIModel) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={enhanceDescription}
                      disabled={isEnhancing || !aiModel || !formData.description}
                    >
                      {isEnhancing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Wand2 className="mr-2 h-4 w-4" />
                          Enhance
                        </>
                      )}
                    </Button>
                  </div>

                  <Textarea
                    id="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What's your project about?"
                    className="max-w-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Genres</Label>
                  <ScrollArea className="h-[120px] w-full max-w-xl rounded-md border p-4">
                    <div className="flex flex-wrap gap-2">
                      {genreTags.map((genre) => (
                        <Badge
                          key={genre}
                          variant={formData.genres.includes(genre) ? "default" : "outline"}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => toggleGenre(genre)}
                        >
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cover Image Display */}
                <div className="w-full max-w-xl space-y-4">
                  <div className="relative w-full" style={{ aspectRatio: `${COVER_WIDTH}/${COVER_HEIGHT}` }}>
                    <div className="w-full h-full border rounded-lg overflow-hidden bg-muted">
                      {progressDetails.isGenerating ? (
                        <div className="w-full h-full animate-pulse flex items-center justify-center">
                          <p className="text-muted-foreground">Generating cover...</p>
                        </div>
                      ) : generatedImages.length > 0 ? (
                        <div className="grid grid-cols-2 h-full gap-4 p-4">
                          {generatedImages.map((image, index) => (
                            <div 
                              key={index}
                              className={`relative w-full h-full rounded-lg overflow-hidden border cursor-pointer ${
                                formData.coverImage === image ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => setFormData(prev => ({ ...prev, coverImage: image }))}
                            >
                              <Image 
                                src={image} 
                                alt={`Generated cover ${index + 1}`} 
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                              />
                            </div>
                          ))}
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={clearCover}
                          >
                            Clear Cover
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
                          <p className="text-muted-foreground">No cover image yet</p>
                          <div className="flex gap-4">
                            <Label 
                              htmlFor="coverUpload" 
                              className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                            >
                              Upload Image
                            </Label>
                            <Input
                              id="coverUpload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Preview when generating */}
                  {progressDetails.isGenerating && progressDetails.currentImage && (
                    <div className="w-full aspect-square relative border rounded-lg overflow-hidden">
                      <Image
                        src={`data:image/jpeg;base64,${progressDetails.currentImage}`}
                        alt="Generation preview"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-6 max-w-xl">
                  <div className="space-y-2">
                    <Label>Base Model</Label>
                    <Select onValueChange={handleModelChange} disabled={isLoadingModel}>
                      <SelectTrigger>
                        {formData.model || "Choose Model"}
                      </SelectTrigger>
                      <SelectContent>
                        {models.map((model, index) => (
                          <SelectItem key={index} value={model.title}>
                            {model.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isLoadingModel && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                          style={{ width: `${modelLoadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>LoRA Model</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, lora: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a LoRA" />
                      </SelectTrigger>
                      <SelectContent>
                        {loraModels.map((lora: any, index) => (
                          <SelectItem key={index} value={lora.name}>
                            {lora.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Prompt</Label>
                      <div className="flex items-center gap-2">
                        <Select 
                          value={aiProvider} 
                          onValueChange={(value: 'google' | 'anthropic' | 'lmstudio') => {
                            setAiProvider(value);
                            setAiModel(''); // Reset model when provider changes
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="AI Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="google">Google AI</SelectItem>
                            <SelectItem value="anthropic">Anthropic</SelectItem>
                            <SelectItem value="lmstudio">LM Studio</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select 
                          value={aiModel} 
                          onValueChange={setAiModel}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Model" />
                          </SelectTrigger>
                          <SelectContent>
                            {aiModels[aiProvider]?.map((model: AIModel) => (
                              <SelectItem key={model.id} value={model.id}>
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={enhancePrompt}
                          disabled={isEnhancing || !aiModel || !formData.prompt}
                        >
                          {isEnhancing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <Wand2 className="mr-2 h-4 w-4" />
                              Enhance
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <Textarea
                      rows={4}
                      value={formData.prompt}
                      onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
                      placeholder="Enter your prompt..."
                      className="max-w-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Negative Prompt</Label>
                    <Textarea
                      rows={4}
                      value={formData.negativePrompt}
                      onChange={(e) => setFormData(prev => ({ ...prev, negativePrompt: e.target.value }))}
                      placeholder="Enter negative prompt..."
                      className="max-w-xl"
                    />
                    <p className="text-sm text-muted-foreground">
                      Common negative embeddings are included by default to improve image quality
                    </p>
                  </div>

                  {/* Generation Steps */}
                  <div className="space-y-2">
                    <Label>Generation Steps</Label>
                    <Input
                      type="number"
                      value={formData.steps}
                      onChange={(e) => setFormData(prev => ({ ...prev, steps: parseInt(e.target.value) }))}
                      placeholder="Enter number of steps..."
                      className="max-w-xl"
                    />
                  </div>

                  {/* Generate Cover Gold Button */}
                  <div className="space-y-2">
                    <Button 
                      onClick={generateCover} 
                      disabled={progressDetails.isGenerating}
                    >
                      {progressDetails.isGenerating ? "Generating..." : "Generate Cover"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-4 pt-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-32"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            className="w-32"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
} 