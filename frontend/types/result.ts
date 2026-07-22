export interface PlatformContent {
  platform: string;
  hook: string;
  content: string;
  call_to_action: string;
  hashtags: string[];
}

export interface LanguageContent {
  language: string;
  contents: PlatformContent[];
}

export interface GenerateResponse {
  generated: LanguageContent[];
}
