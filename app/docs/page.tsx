"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { LavaFlow } from "@/components/lavaflow";
import { DocsNavigation } from "@/components/docs-navigation";

export default function DocsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DocsNavigation showBackButton={false} />

      <div className="flex-1 p-6 relative overflow-y-auto">
        <div className="mb-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Documentation</h1>
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <h3 className="font-semibold mb-2">Creating Your First Project</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn how to create and set up your first comic project using Comic Forge.
                  </p>
                  <Button variant="link" asChild className="mt-2 p-0">
                    <Link href="/docs/getting-started">Read More →</Link>
                  </Button>
                </div>
                <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <h3 className="font-semibold mb-2">AI Tools Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    Discover how to leverage AI tools for artwork generation and story development.
                  </p>
                  <Button variant="link" asChild className="mt-2 p-0">
                    <Link href="/docs/ai-tools">Read More →</Link>
                  </Button>
                </div>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Popular Topics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <h3 className="font-semibold mb-2">Project Management</h3>
                  <p className="text-sm text-muted-foreground">
                    Best practices for organizing your comic projects effectively.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <h3 className="font-semibold mb-2">Chapter Creation</h3>
                  <p className="text-sm text-muted-foreground">
                    Learn about our powerful chapter creation tools and features.
                  </p>
                </div>
                <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <h3 className="font-semibold mb-2">Collaboration</h3>
                  <p className="text-sm text-muted-foreground">
                    Work together with team members on your comic projects.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API & Integration</h2>
              <div className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold mb-2">API Documentation</h3>
                    <p className="text-sm text-muted-foreground">
                      Complete API reference for integrating Comic Forge with your applications.
                    </p>
                  </div>
                  <Button variant="secondary" asChild>
                    <Link href="/docs/api">View API Docs</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>

        <LavaFlow />
      </div>
    </div>
  );
}