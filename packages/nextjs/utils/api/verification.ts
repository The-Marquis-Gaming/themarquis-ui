import api from ".";
import { IVerification } from "./type";
async function Verification(data: IVerification): Promise<any> {
  return await api.post("auth/verify-code", data);
}

export { Verification };
