"use client";

import { useState, useEffect } from "react";
import { ProjectCard } from "@/components/project-card";
import { mockProjects } from "@/lib/mock-data";
import { Project } from "@/types/project";

export function ProjectGrid() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (isMounted) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        if (isMounted) {
          setError("Could not load projects. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-gray-500 text-center">No projects found</p>
        <button
          onClick={() => window.location.href = '/projects/new'}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Create New Project
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
