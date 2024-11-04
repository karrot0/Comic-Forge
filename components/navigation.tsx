"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, LayoutDashboard, Settings, BookOpenCheck } from "lucide-react";
import Image from "next/image";

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="mx-auto px-4">
        <div className="flex h-16 items-center space-x-4 sm:space-x-8">
          <Link href="/projects" className="flex items-center space-x-2">
            <Image src="/Logo.png" alt="Comic Forge Logo" width={24} height={24} />
            <span className="text-xl font-bold font-mono">Comic Forge</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}