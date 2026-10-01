export type ImageDesignStyle =
  | "auto"
  | "minimal"
  | "premium"
  | "luxury"
  | "bold"
  | "corporate"
  | "playful"
  | "modern";

export type ImageFormat =
  | "auto"
  | "square"
  | "portrait"
  | "story"
  | "landscape";

export type GeneratedImageStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed";

export type GeneratedImage = {
  uid: string;
  generation_uid: string;
  source_language: string;
  source_variant: string;
  provider: string;
  status: GeneratedImageStatus;
  image_url: string | null;
  error_message: string | null;
  created_at: string;
};

export type QuickDesignPayload = {
  source_language: string;
  source_variant: string;
};

export type CustomDesignPayload = {
  source_language: string;
  source_variant: string;

  brand_name?: string;
  tagline?: string;
  brand_colors?: string[];

  headline?: string;
  subheadline?: string;
  call_to_action?: string;
  price_text?: string;
  promo_text?: string;

  whatsapp?: string;
  phone?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  address?: string;

  design_style?: ImageDesignStyle;
  format?: ImageFormat;
  design_notes?: string;
  include_hashtags?: boolean;

  logo_asset_uid?: string | null;
  primary_asset_uids?: string[];
  reference_asset_uids?: string[];
};

async function readError(response: Response, fallback: string) {
  try {
    const data = await response.json();

    return data?.detail || data?.message || fallback;
  } catch {
    return fallback;
  }
}

export async function createQuickDesign(
  generationUid: string,
  payload: QuickDesignPayload,
): Promise<GeneratedImage> {
  const response = await fetch(`/api/generations/${generationUid}/images`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Couldn't start Quick Design."));
  }

  return response.json();
}

export async function createCustomDesign(
  generationUid: string,
  payload: CustomDesignPayload,
): Promise<GeneratedImage> {
  const response = await fetch(`/api/generations/${generationUid}/images`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cleanCustomPayload(payload)),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Couldn't start Custom Design."));
  }

  return response.json();
}

export async function getGeneratedImages(
  generationUid: string,
): Promise<GeneratedImage[]> {
  const response = await fetch(`/api/generations/${generationUid}/images`, {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      await readError(response, "Couldn't load generated images."),
    );
  }

  const data = await response.json();

  return Array.isArray(data) ? data : [];
}

function cleanCustomPayload(payload: CustomDesignPayload): CustomDesignPayload {
  const cleaned: CustomDesignPayload = {
    source_language: payload.source_language,

    source_variant: payload.source_variant,
  };

  const stringFields: Array<keyof CustomDesignPayload> = [
    "brand_name",
    "tagline",
    "headline",
    "subheadline",
    "call_to_action",
    "price_text",
    "promo_text",
    "whatsapp",
    "phone",
    "instagram",
    "tiktok",
    "twitter",
    "facebook",
    "website",
    "address",
    "design_notes",
  ];

  for (const field of stringFields) {
    const value = payload[field];

    if (typeof value === "string" && value.trim()) {
      (cleaned as Record<string, unknown>)[field] = value.trim();
    }
  }

  if (payload.brand_colors?.length) {
    cleaned.brand_colors = payload.brand_colors;
  }

  if (payload.design_style) {
    cleaned.design_style = payload.design_style;
  }

  if (payload.format) {
    cleaned.format = payload.format;
  }

  if (typeof payload.include_hashtags === "boolean") {
    cleaned.include_hashtags = payload.include_hashtags;
  }

  if (payload.logo_asset_uid) {
    cleaned.logo_asset_uid = payload.logo_asset_uid;
  }

  if (payload.primary_asset_uids?.length) {
    cleaned.primary_asset_uids = payload.primary_asset_uids;
  }

  if (payload.reference_asset_uids?.length) {
    cleaned.reference_asset_uids = payload.reference_asset_uids;
  }

  return cleaned;
}
