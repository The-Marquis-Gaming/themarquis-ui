import api from ".";
import { login } from "./type";
async function Login(data: login): Promise<any> {
  return await api.post("auth/signin", data);
}

export { Login };
