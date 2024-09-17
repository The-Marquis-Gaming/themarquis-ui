export interface ISignup {
  email: string;
  referral_code: string;
}

export interface IVerification {
  email: string;
  code: string;
}

export interface IWithdraw {
  account_address: string;
  amount: string;
  token_address: string;
}

export interface IResend {
  email: string;
}

export interface ILogin {
  email: string;
}

export interface IUserInfo {
  user: any;
  created_at: string;
  email: string;
  id: number;
  role: string;
  status: string;
  updated_at: string;
  account_address?: string;
  referral_code?: string;
  points?: string;
}

export interface ILogout {
  user_id: number;
}

export interface IReferralCode {
  code: string;
  created_at: string;
  id: number;
  times_used: number;
  updated_at: string;
}
