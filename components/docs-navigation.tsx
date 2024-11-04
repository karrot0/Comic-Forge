"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, LayoutDashboard, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DocsNavigationProps {
  showBackButton?: boolean;
}

export function DocsNavigation({ showBackButton = true }: DocsNavigationProps) {
  const pathname = usePathname();

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
      href: "/settings",
      label: "Settings", 
      icon: Settings
    }
  ];

  return (
    <div className="w-64 border-r p-6 space-y-4">
      {showBackButton && (
        <Button variant="ghost" asChild className="w-full justify-start mb-4">
          <Link href="/docs" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Docs
          </Link>
        </Button>
      )}

      {sidebarItems.map((item) => {
        const Icon = item.icon;
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

      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Documentation</h4>
        <div className="space-y-1">
          <Button
            variant={pathname === "/docs/getting-started" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/docs/getting-started">Getting Started</Link>
          </Button>
          <Button
            variant={pathname === "/docs/ai-tools" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/docs/ai-tools">AI Tools</Link>
          </Button>
          <Button
            variant={pathname === "/docs/api" ? "secondary" : "ghost"}
            size="sm"
            className="w-full justify-start"
            asChild
          >
            <Link href="/docs/api">API Reference</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 