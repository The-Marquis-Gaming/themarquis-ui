export interface signup {
  email: string;
  referral_code: string;
}

export interface verification {
  email: string;
  code: string;
}

export interface resend {
  email: string;
}

export interface login {
  email: string;
  password: string;
}

export interface userInfo {
  user: any;
  created_at: string;
  email: string;
  id: number;
  role: string;
  status: string;
  updated_at: string;
  account_address?: string;
}

export interface logout {
  user_id: number;
}

export interface referralCode {
  code: string;
  created_at: string;
  id: number;
  times_used: number;
  updated_at: string;
}
