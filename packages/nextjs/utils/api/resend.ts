import api from ".";
import { IResend } from "./type";
async function Resend(data: IResend): Promise<any> {
  return await api.post("auth/resend-verification-email", data);
}

export { Resend };
