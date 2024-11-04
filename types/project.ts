export interface Project {
  id: string;
  name: string;
  description: string;
  status: "ongoing" | "completed" | "hiatus";
  genres: string[];
  coverImage?: string;
  created: string;
  updated: string;
  chapters: {
    id: string;
    title: string;
    content: string;
    created: string;
    updated: string;
  }[];
  characters: {
    id: string;
    name: string;
    description: string;
    created: string;
    updated: string;
  }[];
  assets: {
    id: string;
    name: string;
    type: string;
    url: string;
    created: string;
    updated: string;
  }[];
}