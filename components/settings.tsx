"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [settings, setSettings] = useState({
    auto1111Host: 'http://localhost',
    auto1111Port: '7860',
    comfyuiHost: 'http://localhost',
    comfyuiPort: '8188',
    googleApiKey: '',
    anthropicApiKey: '',
  });
  const [showApiKeys, setShowApiKeys] = useState({
    gemini: false,
    anthropic: false
  });

  const testAuto1111Connection = async () => {
    setIsLoading(true);
    if (!settings.auto1111Host || !settings.auto1111Port) {
      toast({
        title: "Input Error",
        description: "Please provide both Auto1111 host and port.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
  
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
      const modelNames = data.map((model: { title: string }) => model.title);
      setModels(modelNames);
      toast({
        title: "Connection Successful",
        description: `Successfully connected to Auto1111. Found ${modelNames.length} models.`,
      });
    } catch (error) {
      console.error('Auto1111 connection test failed:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Auto1111. Please check your settings.",
        variant: "destructive",
      });
      setModels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      handleGetSettings();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your Comic Forge preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai-tools" className="w-full">
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="ai-tools">AI Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="ai-tools" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-4 p-4 rounded-lg border">
                <h3 className="font-semibold">Stable Diffusion Auto1111</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Host</Label>
                    <Input 
                      placeholder="http://localhost" 
                      value={settings.auto1111Host}
                      onChange={(e) => setSettings({
                        ...settings,
                        auto1111Host: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input 
                      placeholder="7860"
                      value={settings.auto1111Port}
                      onChange={(e) => setSettings({
                        ...settings,
                        auto1111Port: e.target.value
                      })}
                    />
                  </div>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={testAuto1111Connection}
                  className="w-full"
                  disabled={isLoading}
                >
                  Test Connection
                </Button>
                {models.length > 0 && (
                  <div className="mt-4">
                    <Label className="mb-2 block">Loaded Models</Label>
                    <div className="flex flex-wrap gap-2">
                      {models.map((model) => (
                        <Badge 
                          key={model} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4 p-4 rounded-lg border">
                <h3 className="font-semibold">ComfyUI</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Host</Label>
                    <Input 
                      placeholder="http://localhost"
                      value={settings.comfyuiHost}
                      onChange={(e) => setSettings({
                        ...settings,
                        comfyuiHost: e.target.value
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Port</Label>
                    <Input 
                      placeholder="8188"
                      value={settings.comfyuiPort}
                      onChange={(e) => setSettings({
                        ...settings,
                        comfyuiPort: e.target.value
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-lg border">
                <h3 className="font-semibold">Language Models</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Google Gemini API Key</Label>
                    <div className="relative">
                      <Input 
                        type={showApiKeys.gemini ? "text" : "password"}
                        placeholder="Enter your Gemini API key"
                        value={settings.googleApiKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          googleApiKey: e.target.value
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto py-1"
                        onClick={() => setShowApiKeys(prev => ({
                          ...prev,
                          gemini: !prev.gemini
                        }))}
                      >
                        {showApiKeys.gemini ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Anthropic API Key</Label>
                    <div className="relative">
                      <Input 
                        type={showApiKeys.anthropic ? "text" : "password"}
                        placeholder="Enter your Anthropic API key"
                        value={settings.anthropicApiKey}
                        onChange={(e) => setSettings({
                          ...settings,
                          anthropicApiKey: e.target.value
                        })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto py-1"
                        onClick={() => setShowApiKeys(prev => ({
                          ...prev,
                          anthropic: !prev.anthropic
                        }))}
                      >
                        {showApiKeys.anthropic ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-6 space-x-2 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
