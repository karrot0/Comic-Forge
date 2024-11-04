"use client";

import { ProjectGrid } from "@/components/project-grid";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, BookOpen, Settings } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LavaFlow } from "@/components/lavaflow";
import SettingsModal from "@/components/settings";
import { useState } from "react";

export default function ProjectsPage() {
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  const sidebarItems = [
    {
      href: "/projects",
      label: "Projects",
      icon: LayoutDashboard
    },
    {
      href: "/docs", 
      label: "Documentation",
      icon: BookOpen
    },
    {
      label: "Settings", 
      icon: Settings,
      onClick: () => setShowSettings(true)
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 border-r p-6 space-y-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          if (item.onClick) {
            return (
              <Button
                key={item.label}
                variant={pathname === item.href ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={item.onClick}
              >
                <div className="flex items-center space-x-2">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </Button>
            );
          }
          return (
            <Button
              key={item.href}
              variant={pathname === item.href ? "default" : "ghost"}
              className="w-full justify-start"
              asChild
            >
              <Link href={item.href} className="flex items-center space-x-2">
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>

      <div className="flex-1 p-6 relative overflow-y-auto">
        {/* Welcome Hero Section */}
        <div className="mb-12 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Welcome to Comic Forge</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Your all-in-one platform for creating and managing your comic projects
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-card shadow-[0_4px_10px_-3px_rgba(255,0,0,0.3)]">
              <h3 className="font-semibold mb-2">Create Projects</h3>
              <p className="text-sm text-muted-foreground">
                Organize your comic ideas and track their progress
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card shadow-[0_4px_10px_-3px_rgba(255,0,0,0.3)]">
              <h3 className="font-semibold mb-2">Create Chapters</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage chapters using AI-powered tools
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-card shadow-[0_4px_10px_-3px_rgba(255,0,0,0.3)]">
              <h3 className="font-semibold mb-2">AI Tools</h3>
              <p className="text-sm text-muted-foreground">
                Use AI tools to create artwork, summaries, and more
              </p>
            </div>
          </div>
        </div>

        <div className="h-full w-full space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <Button onClick={() => window.location.href = '/projects/new'}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
          <Separator/>
          <ProjectGrid />
        </div>

        <LavaFlow />
      </div>

      <SettingsModal 
        open={showSettings} 
        onOpenChange={setShowSettings}
      />
    </div>
  );
}