// /pages/api/projects.ts

import { NextApiRequest, NextApiResponse } from 'next';
import fs from "fs";
import fsPromises from 'fs/promises';
import path from "path";
import { Project } from "@/types/project";
import { v4 as uuidv4 } from 'uuid';

// Helper function to get the path for project JSON files
const getProjectsPath = () => path.join(process.cwd(), "public", "projects");

// Fetch a single project by ID from public/projects/[id].json
async function getProjectById(id: string): Promise<Project | null> {
  try {
    const filePath = path.join(getProjectsPath(), `${id}`, "project.json");
    if (!fs.existsSync(filePath)) {
      console.warn(`Project file for ID ${id} does not exist.`);
      return null;
    }

    const projectData = await fs.promises.readFile(filePath, "utf-8");
    return JSON.parse(projectData);
  } catch (error) {
    console.error(`Error reading project file for ID ${id}:`, error);
    return null;
  }
}

// Fetch all projects from public/projects folder
async function getAllProjects(): Promise<Project[]> {
  try {
    const projectsPath = getProjectsPath();
    
    // Create projects directory if it doesn't exist
    if (!fs.existsSync(projectsPath)) {
      fs.mkdirSync(projectsPath, { recursive: true });
      return [];
    }

    const folders = await fs.promises.readdir(projectsPath); // Read all folders in Projects directory

    // For every folder in Projects directory, read the project.json file and return the project data
    const projectData = await Promise.all(
      folders.map(async (folder) => {
        const projectJsonPath = path.join(projectsPath, folder, 'project.json');
        if (!fs.existsSync(projectJsonPath)) {
          return null;
        }
        const data = await fs.promises.readFile(projectJsonPath, "utf-8");
        return JSON.parse(data);
      })
    );

    // Filter out any null values from folders without project.json
    return projectData.filter((project): project is Project => project !== null);
  } catch (error) {
    console.error(`Error reading projects:`, error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") { // Get all projects
    try {
      const projects = await getAllProjects();
      res.status(200).json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  }
  else if (req.method === "POST") { // Create a new project
    try {
      const projectData = req.body;
      const projectId = uuidv4();
      const projectSlug = projectData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      // Create project directory structure
      const projectDir = path.join(process.cwd(), 'public', 'projects', `${projectSlug}-${projectId}`);
      const subDirs = ['chapters', 'characters', 'covers'];
  
      // Create main project directory
      await fsPromises.mkdir(projectDir, { recursive: true });
  
      // Create subdirectories
      await Promise.all(subDirs.map(dir => 
        fsPromises.mkdir(path.join(projectDir, dir), { recursive: true })
      ));
  
      // Move cover image if it exists
      if (projectData.coverImage) {
        const originalPath = path.join(process.cwd(), 'public', projectData.coverImage);
        const newPath = path.join(projectDir, 'covers', path.basename(projectData.coverImage));
        
        if (fs.existsSync(originalPath)) {
          await fsPromises.rename(originalPath, newPath);
          projectData.coverImage = `/projects/${projectSlug}-${projectId}/covers/${path.basename(projectData.coverImage)}`;
        }
      }
  
      // Create project.json
      const projectConfig = {
        id: projectId,
        ...projectData,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
      };
  
      await fsPromises.writeFile(
        path.join(projectDir, 'project.json'),
        JSON.stringify(projectConfig, null, 2)
      );
  
      res.status(200).json({ 
        success: true, 
        projectId,
        path: `/projects/${projectSlug}-${projectId}`
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ 
        error: 'Failed to create project', 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === "SINGLE") { // Get a single project
    try {
      const project = await getProjectById(req.query.id as string);
      res.status(200).json(project);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export { getProjectById, getAllProjects };