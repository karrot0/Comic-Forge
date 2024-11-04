"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";

export function ChapterList() {
  const params = useParams();
  const id = params?.id;
  const [chapters] = useState([
    { id: "1", title: "Chapter 1: The Beginning" },
    { id: "2", title: "Chapter 2: The Journey" },
    { id: "3", title: "Chapter 3: The Challenge" },
  ]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Chapters</span>
        <Button variant="ghost" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[300px]">
        <div className="space-y-1">
          {chapters.map((chapter) => (
            <Button
              key={chapter.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              asChild
            >
              <Link href={`/projects/${id}/chapters/${chapter.id}`}>
                {chapter.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}