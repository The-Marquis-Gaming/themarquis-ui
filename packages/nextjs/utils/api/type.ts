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
