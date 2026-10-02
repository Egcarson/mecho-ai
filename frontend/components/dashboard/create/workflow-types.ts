export const socialStoryLengths = [
  {
    label: "Short",
    value: "short",
    description: "A concise story with a quick narrative arc.",
  },
  {
    label: "Medium",
    value: "medium",
    description: "More room for context, development, and payoff.",
  },
  {
    label: "Long",
    value: "long",
    description: "A fuller story with stronger detail and progression.",
  },
  {
    label: "Extended",
    value: "extended",
    description: "A deeply developed story with maximum narrative room.",
  },
];

export type Option = {
  label: string;
  value: string;
};

export type GenerationPhase =
  | "idle"
  | "creating_project"
  | "uploading_document"
  | "generating"
  | "completed"
  | "failed";

export type ProjectResponse = {
  uid: string;
  name: string;
  workflow: string;
  status: string;
};

export type GenerationResponse = {
  uid: string;
  project_uid: string;
  status: string;
  output_content: string;
  error_message: string | null;
};

export type SocialData = {
  subject: string;
  objective: string;
  story_length: string;
  audiences: string[];
  platforms: string[];
  tone: string;
  languages: string[];
  document: File | null;
};

export type PlatformContent = {
  platform: string;
  hook: string;
  content: string;
  call_to_action: string;
  hashtags: string[];
};

export type LanguageContent = {
  language: string;
  contents: PlatformContent[];
};

export type SocialGenerateResponse = {
  generated: LanguageContent[];
};

export type CampaignData = {
  brief: string;
  objective: string;
  audiences: string[];
  tone: string;
  languages: string[];
  length: string;
  document: File | null;
};

export type SpeechData = {
  brief: string;
  memories: {
    memory: string;
    significance: string;
    emphasis: boolean;
  }[];
  objective: string;
  audiences: string[];
  tone: string;
  language: string;
  length: string;
  document: File | null;
  targetDurationMinutes: number | null;
};
