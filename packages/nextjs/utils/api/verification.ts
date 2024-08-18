import api from ".";
import { verification } from "./type";
async function Verification(data: verification): Promise<any> {
  return await api.post("auth/verify-code", data);
}

export { Verification };
