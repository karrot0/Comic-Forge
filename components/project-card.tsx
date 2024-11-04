"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      // Delete the project
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete project");

      // If project has a cover image, delete it too
      if (project.coverImage) {
        const imageResponse = await fetch('/api/upload', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: project.coverImage })
        });

        if (!imageResponse.ok) {
          console.error('Failed to delete cover image');
        }
      }

      toast.success("Project deleted successfully");
      router.refresh(); // Refresh the page to update the project list
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <Card className="overflow-hidden w-72">
      <CardHeader className="p-0">
        <div className="relative aspect-[2/3] h-48">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Cover</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{project.name}</h3>
          {project.status && (
            <Badge variant={getStatusVariant(project.status)}>
              {project.status}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {project.genres.map((genre) => (
            <Badge key={genre} variant="outline">
              {genre}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button asChild>
          <Link href={`/projects/${project.id}`}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "default";
    case "completed":
      return "secondary";
    case "hiatus":
      return "outline";
    case "dropped":
      return "destructive";
    default:
      return "secondary";
  }
}