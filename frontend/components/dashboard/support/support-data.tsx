import {
  BookOpen,
  FolderKanban,
  ImageIcon,
  Library,
  MessageSquareText,
  Settings,
  Volume2,
} from "lucide-react";

export type SupportCategoryId =
  | "getting-started"
  | "content"
  | "images"
  | "voice"
  | "projects"
  | "account";

export type SupportCategory = {
  id: SupportCategoryId;
  title: string;
  description: string;
  icon: typeof BookOpen;
};

export type SupportFaq = {
  id: string;
  category: SupportCategoryId;
  question: string;
  answer: string;
};

/**
 * Support categories are intentionally broad.
 *
 * They should map to how users think about Mecho, not how the backend
 * happens to be structured internally.
 */
export const SUPPORT_CATEGORIES: SupportCategory[] = [
  {
    id: "getting-started",
    title: "Getting started",
    description: "Understand Mecho's workflows and how to start creating.",
    icon: BookOpen,
  },
  {
    id: "content",
    title: "Creating content",
    description: "Help with Social, Campaign and generated content.",
    icon: MessageSquareText,
  },
  {
    id: "images",
    title: "Image designs",
    description: "Quick Design, Custom Design and reusable image assets.",
    icon: ImageIcon,
  },
  {
    id: "voice",
    title: "Voice generation",
    description: "Generate, play and download voice versions of your content.",
    icon: Volume2,
  },
  {
    id: "projects",
    title: "Projects & Library",
    description: "Find previous work, generated media and project history.",
    icon: FolderKanban,
  },
  {
    id: "account",
    title: "Account & settings",
    description: "Profile, password, preferences and account controls.",
    icon: Settings,
  },
];

/**
 * FAQ copy should describe the product as it actually behaves.
 *
 * When major workflow behavior changes, update this file alongside
 * the related feature so Support does not become stale.
 */
export const SUPPORT_FAQS: SupportFaq[] = [
  {
    id: "social-vs-campaign",
    category: "getting-started",
    question: "What is the difference between Social and Campaign?",
    answer:
      "Social is for content created for social platforms, including organic posts, promotional content and platform-specific messaging. Campaign is for more structured public or institutional communication such as awareness campaigns, events, NGOs, hospitals and government initiatives.",
  },
  {
    id: "speech-workflow",
    category: "getting-started",
    question: "When should I use Speech?",
    answer:
      "Use Speech when you want Mecho to create a structured speech from an objective, audience, event details, memories or other talking points.",
  },
  {
    id: "switch-language-platform",
    category: "content",
    question: "Can I switch between generated languages and platforms?",
    answer:
      "Yes. Social results can contain multiple languages and platform versions. Select a language first, then choose the platform version you want to review or turn into media.",
  },
  {
    id: "copy-content",
    category: "content",
    question: "Can I copy generated content?",
    answer:
      "Yes. Generated Social and Campaign content includes copy actions so you can quickly move the final message into another app or workflow.",
  },
  {
    id: "quick-design",
    category: "images",
    question: "How does Quick Design work?",
    answer:
      "Quick Design creates a visual directly from the generated content you are currently viewing. You do not need to fill any design fields. Mecho uses the current language and content variant internally.",
  },
  {
    id: "custom-design",
    category: "images",
    question: "What is Custom Design?",
    answer:
      "Custom Design gives you optional control over details such as headline, brand name, colors, style, format, promotional text, contact information, logo, primary images and reference images. You can provide as much or as little guidance as you want.",
  },
  {
    id: "reuse-images",
    category: "images",
    question: "Can I reuse a logo or image I uploaded before?",
    answer:
      "Yes. Uploaded logo, primary and reference images are stored as reusable assets. When creating another design, you can choose an existing asset instead of uploading the same file again.",
  },
  {
    id: "image-taking-long",
    category: "images",
    question: "Why is an image taking longer than expected?",
    answer:
      "Image generation can take longer depending on the provider and the complexity of the request. Mecho will show the generation state while the image is being prepared and will update the design when it is ready.",
  },
  {
    id: "failed-image",
    category: "images",
    question: "What happens if image generation fails?",
    answer:
      "Mecho will show an error message explaining the failure when one is available. Failed image jobs are not displayed as completed designs, so you can try generating again without failed items cluttering the gallery.",
  },
  {
    id: "voice-generation",
    category: "voice",
    question: "How does voice generation work?",
    answer:
      "Open Voice from the media actions on a generated result, choose an available voice when required, and Mecho will generate audio using the currently selected language and content version.",
  },
  {
    id: "where-media",
    category: "projects",
    question: "Where can I find generated images and voice files?",
    answer:
      "Generated media is available in the Library. You can use Library filters to browse different media types and open individual assets for preview or download.",
  },
  {
    id: "previous-generations",
    category: "projects",
    question: "Where can I find previous generations?",
    answer:
      "Use Projects to open work grouped by project, or History to review previous generations across your account.",
  },
  {
    id: "change-password",
    category: "account",
    question: "How do I change my password?",
    answer:
      "Open Settings and use the password section. After changing your password, Mecho may also give you the option to sign out other sessions.",
  },
  {
    id: "profile-settings",
    category: "account",
    question: "Where can I update my profile or preferences?",
    answer:
      "Open Settings from the dashboard navigation. Your profile information and supported preferences are managed there.",
  },
];

/**
 * Used by the contact form.
 *
 * Prefer NEXT_PUBLIC_SUPPORT_EMAIL in production.
 * The fallback prevents the page from breaking during local development.
 */
export const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@mecho.ai";
