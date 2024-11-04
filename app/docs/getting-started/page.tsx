"use client";

import { DocsNavigation } from "@/components/docs-navigation";
import { LavaFlow } from "@/components/lavaflow";
import Link from "next/link";

export default function GettingStartedPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DocsNavigation />

      <div className="flex-1 p-6 relative overflow-y-auto">
        <div className="mb-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Getting Started with Comic Forge</h1>
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Creating Your First Project</h2>
              <div className="prose dark:prose-invert">
                <p>Follow these simple steps to create your first comic project:</p>
                <ol>
                  <li>Navigate to the Projects page</li>
                  <li>Click the "Create Project" button in the top right</li>
                  <li>Fill in your project details:
                    <ul>
                      <li>Project title</li>
                      <li>Description</li>
                      <li>Genre</li>
                      <li>Target audience</li>
                    </ul>
                  </li>
                  <li>Click "Create" to initialize your project</li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
              <div className="prose dark:prose-invert">
                <p>Each project in Comic Forge is organized into:</p>
                <ul>
                  <li><strong>Chapters:</strong> Main story segments</li>
                  <li><strong>Characters:</strong> Character profiles and development</li>
                  <li><strong>Assets:</strong> Artwork and resources</li>
                  <li><strong>Notes:</strong> Story development and ideas</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Next Steps</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/docs/ai-tools" className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                  <h3 className="font-semibold mb-2">Explore AI Tools →</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how to use AI-powered tools for artwork and story development
                  </p>
                </Link>
                <Link href="/docs/chapters" className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                  <h3 className="font-semibold mb-2">Chapter Management →</h3>
                  <p className="text-sm text-muted-foreground">
                    Understand how to create and organize your chapters effectively
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </div>

        <LavaFlow />
      </div>
    </div>
  );
} 