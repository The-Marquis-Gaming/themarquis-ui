import api from ".";
import { resend } from "./type";
async function Resend(data: resend): Promise<any> {
  return await api.post("auth/resend-verification-email", data);
}

export { Resend };
