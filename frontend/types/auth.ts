export type AuthUser = {
  uid: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone: string;
  profile_picture_url: string | null;
  avatar: string | null;
  role: string;
  provider: string;
  is_verified: boolean;
  created_at: string;
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
