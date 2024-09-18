import api from ".";
import { ISignup } from "./type";
async function signUp(data: ISignup): Promise<any> {
  return await api.post("auth/signup", data);
}

export { signUp };
