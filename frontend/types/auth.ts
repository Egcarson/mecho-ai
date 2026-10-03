export type UserPreferences = {
  default_language: string | null;
  default_tone: string | null;
  default_voice: string | null;
  default_workflow: string | null;
  preferences: Record<string, unknown>;
};

export type AuthUser = {
  uid: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone: string | null;
  profile_picture_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  preferences: UserPreferences | null;
};

export type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  user: AuthUser;
};

export type LogoutResponse = {
  success: boolean;
  message: string;
};
