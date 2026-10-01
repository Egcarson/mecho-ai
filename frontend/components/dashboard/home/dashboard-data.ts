import {
  Megaphone,
  MessageSquareText,
  Mic2,
  type LucideIcon,
} from "lucide-react";

export type WorkflowId = "social" | "campaign" | "speech";

export type ComposerState = "idle" | "thinking" | "result";

export type WorkflowDefinition = {
  id: WorkflowId;
  title: string;
  description: string;
  icon: LucideIcon;
};

export type WorkflowResult = {
  title: string;
  description: string;
  context: string[];
  icon: LucideIcon;
};

export const promptExamples = [
  "Help me get more weekend orders for my catering business.",
  "I’m launching a clothing collection next month.",
  "Give me something interesting to post for my business today.",
  "We need to raise awareness about a free health screening.",
  "I need a speech for my sister’s wedding.",
  "Help me promote registration for an upcoming event.",
];

export const thinkingMessages = [
  "Understanding your goal",
  "Choosing the best creative direction",
  "Preparing your starting point",
];

export const workflows: WorkflowDefinition[] = [
  {
    id: "social",
    title: "Social",
    description:
      "Create posts, promotions, visuals and videos made for social media.",
    icon: MessageSquareText,
  },
  {
    id: "campaign",
    title: "Campaign",
    description:
      "Build awareness, public-interest or institutional messaging around an initiative or event.",
    icon: Megaphone,
  },
  {
    id: "speech",
    title: "Speech",
    description:
      "Create something meaningful to say for an event, audience or occasion.",
    icon: Mic2,
  },
];

export const workflowResults: Record<WorkflowId, WorkflowResult> = {
  social: {
    title: "Social",
    icon: MessageSquareText,
    description:
      "This sounds like something that should catch attention naturally on social media and give people a reason to respond.",
    context: ["Posts", "Promotions", "Visuals", "Video"],
  },

  campaign: {
    title: "Campaign",
    icon: Megaphone,
    description:
      "This fits a broader message built to inform, raise awareness, encourage participation or move people around an initiative.",
    context: ["Awareness", "Public interest", "Institutions", "Events"],
  },

  speech: {
    title: "Speech",
    icon: Mic2,
    description:
      "This needs to be shaped around the occasion, the people listening and how you want the moment to feel.",
    context: ["Occasion", "Audience", "Tone", "Memories"],
  },
};

export function detectWorkflow(value: string): WorkflowId {
  const text = value.toLowerCase();

  if (
    text.includes("speech") ||
    text.includes("wedding speech") ||
    text.includes("funeral speech") ||
    text.includes("graduation speech") ||
    text.includes("address the audience") ||
    text.includes("give a talk")
  ) {
    return "speech";
  }

  if (
    text.includes("awareness") ||
    text.includes("hospital") ||
    text.includes("ngo") ||
    text.includes("government") ||
    text.includes("screening") ||
    text.includes("initiative") ||
    text.includes("public health") ||
    text.includes("sensitization") ||
    text.includes("advocacy") ||
    text.includes("community outreach")
  ) {
    return "campaign";
  }

  return "social";
}
