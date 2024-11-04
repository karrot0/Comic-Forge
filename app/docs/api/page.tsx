"use client";

import { DocsNavigation } from "@/components/docs-navigation";
import { LavaFlow } from "@/components/lavaflow";

export default function APIDocsPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <DocsNavigation />

      <div className="flex-1 p-6 relative overflow-y-auto">
        <div className="mb-12 max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">API Documentation</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground mb-4">
                  Comic Forge API uses Bearer token authentication. All API requests must include an Authorization header.
                </p>
                <div className="bg-muted p-2 rounded-md">
                  <code className="text-sm">
                    Authorization: Bearer your-api-token
                  </code>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">API Endpoints</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Projects</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">GET /api/projects</code>
                      <span className="text-muted-foreground ml-2">List all projects</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">POST /api/projects</code>
                      <span className="text-muted-foreground ml-2">Create a new project</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">GET /api/projects/:id</code>
                      <span className="text-muted-foreground ml-2">Get project details</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">PUT /api/projects/:id</code>
                      <span className="text-muted-foreground ml-2">Update project details</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">DELETE /api/projects/:id</code>
                      <span className="text-muted-foreground ml-2">Delete a project</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Chapters</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">GET /api/projects/:id/chapters</code>
                      <span className="text-muted-foreground ml-2">List project chapters</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">POST /api/chapters</code>
                      <span className="text-muted-foreground ml-2">Create a new chapter</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">GET /api/chapters/:id</code>
                      <span className="text-muted-foreground ml-2">Get chapter details</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">PUT /api/chapters/:id</code>
                      <span className="text-muted-foreground ml-2">Update chapter content</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold mb-2">Characters</h3>
                  <div className="space-y-2">
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">GET /api/projects/:id/characters</code>
                      <span className="text-muted-foreground ml-2">List project characters</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">POST /api/characters</code>
                      <span className="text-muted-foreground ml-2">Create a character</span>
                    </p>
                    <p className="text-sm">
                      <code className="bg-muted px-1 rounded">PUT /api/characters/:id</code>
                      <span className="text-muted-foreground ml-2">Update character details</span>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Response Format</h2>
              <div className="p-4 rounded-lg border bg-card">
                <p className="text-sm text-muted-foreground mb-4">
                  All API responses follow a standard format:
                </p>
                <div className="bg-muted p-2 rounded-md">
                  <pre className="text-sm">
{`{
  "success": boolean,
  "data": object | array,
  "error": string | null
}`}
                  </pre>
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