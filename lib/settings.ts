export interface AISettings {
  auto1111Host: string;
  auto1111Port: string;
  comfyUIHost: string;
  comfyUIPort: string;
  geminiApiKey: string;
  anthropicApiKey: string;
}

export interface UserSettings {
  darkMode: boolean;
  autoSave: boolean;
  language: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  collaborationRequests: boolean;
  displayName: string;
  email: string;
  timezone: string;
  ai: AISettings;
}

export async function loadSettings(): Promise<UserSettings> {
  const response = await fetch('/api/settings');
  if (!response.ok) {
    throw new Error('Failed to load settings');
  }
  return response.json();
}

export async function saveSettings(settings: UserSettings): Promise<void> {
  const response = await fetch('/api/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save settings');
  }
} 