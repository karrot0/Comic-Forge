"use client";

import { DocsNavigation } from "@/components/docs-navigation";
import { LavaFlow } from "@/components/lavaflow";

export default function AIToolsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DocsNavigation />

      <div className="flex-1 p-6 relative overflow-y-auto">
        <div className="mb-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">AI Tools Guide</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Available AI Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Artwork Generation</h3>
                  <p className="text-sm text-muted-foreground">
                    Create concept art, character designs, and backgrounds using AI
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                    <li>Style consistency options</li>
                    <li>Character pose generation</li>
                    <li>Background scene creation</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Story Assistant</h3>
                  <p className="text-sm text-muted-foreground">
                    Get help with plot development and dialogue writing
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                    <li>Plot suggestions</li>
                    <li>Character dialogue enhancement</li>
                    <li>Story consistency checking</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Stable Diffusion Interfaces</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">AUTOMATIC1111</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    A powerful and popular interface for Stable Diffusion with extensive features.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Advanced prompt engineering</li>
                    <li>Multiple model support</li>
                    <li>LoRA and Textual Inversion integration</li>
                    <li>Extensive image processing options</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">ComfyUI</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Node-based interface offering granular control over the generation process.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Visual workflow creation</li>
                    <li>Custom node development</li>
                    <li>Advanced parameter control</li>
                    <li>Workflow sharing and import</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Best Practices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Prompt Engineering</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Use detailed, specific descriptions</li>
                    <li>Include style references</li>
                    <li>Specify important details first</li>
                    <li>Use weight modifiers for emphasis</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Model Selection</h3>
                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                    <li>Choose models trained on relevant art</li>
                    <li>Use appropriate LoRA models</li>
                    <li>Test different model combinations</li>
                    <li>Save successful configurations</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Advanced Techniques</h2>
              <div className="p-4 rounded-lg border bg-card">
                <h3 className="font-semibold mb-2">Workflow Integration</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Learn how to integrate AI tools into your comic creation workflow:
                </p>
                <ul className="text-sm text-muted-foreground list-disc list-inside">
                  <li>Use img2img for style consistency</li>
                  <li>Implement ControlNet for pose and layout control</li>
                  <li>Combine multiple LoRA models for specific effects</li>
                  <li>Create and save custom workflows for repeated tasks</li>
                </ul>
              </div>
            </section>
          </div>
        </div>

        <LavaFlow />
      </div>
    </div>
  );
} 