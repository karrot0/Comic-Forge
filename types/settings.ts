// /types/settings.ts

export interface Settings {
  id?: string;
  darkMode: false,
  autoSave: true,
  language: 'en',
  emailNotifications: true,
  pushNotifications: true,
  collaborationRequests: true,
  displayName: '',
  email: '',
  timezone: 'utc',
  auto1111Host?: string;
  auto1111Port?: number;
  googleApiKey?: string;
  anthropicApiKey?: string;
  comfyuiHost: string;
  comfyuiPort: number;
}