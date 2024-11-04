"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Project } from "@/types/project";
import { BookOpen, Settings, Info, LayoutDashboard, Trash2, Save, ImagePlus, Upload, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SettingsModal from "@/components/settings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { genreTags } from "@/types/genretags";

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params?.id;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("chapters");
  const [showSettings, setShowSettings] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editedProject, setEditedProject] = useState<Project | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const availableGenres = genreTags;

  useEffect(() => {
    async function loadProject() {
      const data = await fetch(`/api/projects?id=${id}&method=SINGLE`);
      const json = await data.json();
      setProject(json || null);
      setEditedProject(json || null);
      setLoading(false);
      setEditedProject(json);
    }
    loadProject();
  }, [id]);

  const handleSaveDetails = async () => {
    if (!editedProject) return;

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedProject),
      });

      if (!response.ok) throw new Error('Failed to update project');

      setProject(editedProject);
      toast({
        title: "Success",
        description: "Project details updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project details",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete project');

      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      router.push('/projects');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  const updateEditedProject = (updates: Partial<Project>) => {
    if (!editedProject) return;
    setEditedProject({
      ...editedProject,
      ...updates
    });
  };

  const handleGenreAdd = (newGenre: string) => {
    if (!editedProject) return;
    const currentGenres = editedProject.genres || [];
    if (!currentGenres.includes(newGenre)) {
      updateEditedProject({
        genres: [...currentGenres, newGenre]
      });
    }
  };

  const handleGenreRemove = (indexToRemove: number) => {
    if (!editedProject) return;
    const currentGenres = editedProject.genres || [];
    updateEditedProject({
      genres: currentGenres.filter((_, index) => index !== indexToRemove)
    });
  };

  const handleGenerateCover = async () => {
    if (!editedProject) return;
    
    try {
      setIsGeneratingCover(true);
      const response = await fetch('/api/generate/cover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: id,
          prompt: `Cover art for a ${editedProject.genres.join(', ')} comic titled "${editedProject.name}". ${editedProject.description}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate cover');

      const data = await response.json();
      updateEditedProject({
        coverImage: data.url
      });

      toast({
        title: "Success",
        description: "Cover image generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate cover image",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editedProject) return;

    try {
      setIsUploadingCover(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', id as string);

      const response = await fetch('/api/upload/cover', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload cover');

      const data = await response.json();
      updateEditedProject({
        coverImage: data.url
      });

      toast({
        title: "Success",
        description: "Cover image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload cover image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingCover(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project || !editedProject) return <div>Project not found</div>;

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 border-r p-6 space-y-4">
        <Button
          variant={activeTab === "chapters" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("chapters")}
        >
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Chapters</span>
          </div>
        </Button>
        <div className="pl-4">
          <Button
            variant={activeTab === "allChapters" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("allChapters")}
          >
            <div className="flex items-center space-x-2">
              <span>All Chapters</span>
            </div>
          </Button>
        </div>

        <Button
          variant={activeTab === "characters" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("characters")}
        >
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Characters</span>
          </div>
        </Button>
        <div className="pl-4">
          <Button
            variant={activeTab === "allCharacters" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("allCharacters")}
          >
            <div className="flex items-center space-x-2">
              <span>All Characters</span>
            </div>
          </Button>
        </div>

        <Button
          variant={activeTab === "planner" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("planner")}
        >
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Planner</span>
          </div>
        </Button>

        <Button
          variant={activeTab === "workspace" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("workspace")}
        >
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="h-4 w-4" />
            <span>Workspace</span>
          </div>
        </Button>

        <Button
          variant={activeTab === "details" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("details")}
        >
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4" />
            <span>Details</span>
          </div>
        </Button>

        <div className="pt-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <div className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4" />
              <span>Delete Project</span>
            </div>
          </Button>

          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setShowSettings(true)}
          >
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="flex-1 p-6 relative overflow-y-auto">
        {activeTab === "details" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Project Details</h2>
              <Button onClick={handleSaveDetails}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateEditedProject({
                    name: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateEditedProject({
                    description: e.target.value
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={project.status}
                  onValueChange={(value) => updateEditedProject({
                    status: value as "ongoing" | "completed" | "hiatus"
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="hiatus">Hiatus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Genres</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.genres?.map((genre, index) => (
                    <Badge key={index} variant="secondary">
                      {genre}
                      <button
                        className="ml-1 hover:text-red-500"
                        onClick={() => handleGenreRemove(index)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <Select
                  onValueChange={handleGenreAdd}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGenres
                      .filter(genre => !project.genres?.includes(genre))
                      .map(genre => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border">
                      {project.coverImage ? (
                        <img 
                          src={project.coverImage}
                          alt={`Cover for ${project.name}`}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-muted">
                          <ImagePlus className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => document.getElementById('cover-upload')?.click()}
                        disabled={isUploadingCover}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {isUploadingCover ? "Uploading..." : "Upload"}
                      </Button>
                      <input
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleGenerateCover}
                        disabled={isGeneratingCover}
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        {isGeneratingCover ? "Generating..." : "Generate"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Recommended size: 600x800 pixels
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Project Stats</Label>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="text-sm font-medium">Chapters</p>
                    <p className="text-2xl font-bold">{project.chapters?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="text-sm font-medium">Characters</p>
                    <p className="text-2xl font-bold">{project.characters?.length || 0}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="text-sm font-medium">Assets</p>
                    <p className="text-2xl font-bold">{project.assets?.length || 0}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timestamps</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.created).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card">
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(project.updated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <SettingsModal 
        open={showSettings} 
        onOpenChange={setShowSettings}
      />

      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
