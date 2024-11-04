"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { CharacterForm } from "./character-form";

export function CharacterList() {
  const [characters, setCharacters] = useState([
    { id: "1", name: "Jin-Woo", role: "Protagonist" },
    { id: "2", name: "Cha Hae-In", role: "Supporting" },
  ]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Characters</span>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Character</DialogTitle>
            </DialogHeader>
            <CharacterForm
              onSubmit={(data) => {
                setCharacters([...characters, { id: Date.now().toString(), ...data }]);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-1">
          {characters.map((character) => (
            <Button
              key={character.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
            >
              {character.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}