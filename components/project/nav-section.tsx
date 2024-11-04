"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from 'react'

interface ProjectNavSectionProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export function ProjectNavSection({
  title,
  icon: Icon,
  children,
  isActive,
  onClick,
}: ProjectNavSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4" />
          <span>{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            isExpanded && "rotate-180"
          )}
        />
      </Button>
      {isExpanded && <div className="pl-6">{children}</div>}
    </div>
  );
}