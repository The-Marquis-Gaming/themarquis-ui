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
  created_at: string;
  email: string;
  id: number;
  role: string;
  status: string;
  updated_at: string;
}

export interface logout{
  user_id: number ;
}