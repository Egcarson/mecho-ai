export type Workflow = "social" | "professional";

export interface GenerateSettings {
  workflow: Workflow;

  // Social
  upload: File | null;
  content: string;
  brief: string;

  // Professional Campaign
  campaignTitle: string;
  campaignGoal: string;
  targetAudience: string;
  keyMessage: string;
  callToAction: string;
  additionalNotes: string;

  // AI
  languages: string[];
  tone: string;
  audiences: string[];
  platforms: string[];

  includeEmojis: boolean;
  includeHashtags: boolean;
  optimizeForTrends: boolean;
  country: string;
}
