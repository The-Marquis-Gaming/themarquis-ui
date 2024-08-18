import api from ".";
import { signup } from "./type";
async function signUp(data: signup): Promise<any> {
  return await api.post("auth/signup", data);
}

export { signUp };
