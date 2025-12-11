export type Theme = 'light' | 'dark' | 'auto';

export interface ThemeSettings {
  mode: Theme;
  primaryColor?: string;
}
