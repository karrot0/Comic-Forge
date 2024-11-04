// /pages/api/settings.ts

import { Settings } from '@/types/settings';
import fs from "fs";
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';

const settingsPath = path.join(process.cwd(), 'settings.json');

async function getSettings(): Promise<Settings> {
    try {
        const settings = await fs.promises.readFile(settingsPath, "utf-8");
        return JSON.parse(settings);
    } catch (error) {
        // File does not exist or can't be read, create with defaults
        const defaultSettings: Settings = {
            comfyuiPort: 8111,
            auto1111Port: 7860,
            googleApiKey: '',
            anthropicApiKey: '',
            comfyuiHost: 'localhost',
            auto1111Host: 'localhost',
            darkMode: false,
            autoSave: true,
            language: 'en',
            emailNotifications: true,
            pushNotifications: true,
            collaborationRequests: true,
            displayName: '',
            email: '',
            timezone: 'utc'
        };
        await saveSettings(defaultSettings); // Initialize with defaults
        return defaultSettings;
    }
}

async function saveSettings(settings: Settings): Promise<void> {
    await fs.promises.writeFile(settingsPath, JSON.stringify(settings, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const settings = await getSettings();
            res.status(200).json(settings);
        } catch (error) {
            console.error("Error fetching settings:", error);
            res.status(500).json({ message: "Failed to fetch settings" });
        }
    } else if (req.method === "POST") {
        try {
            const settings = req.body as Settings;

            // Add validation logic here if necessary
            await saveSettings(settings);
            res.status(200).json({ message: "Settings saved" });
        } catch (error) {
            console.error("Error saving settings:", error);
            res.status(500).json({ message: "Failed to save settings" });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}