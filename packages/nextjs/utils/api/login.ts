import api from ".";
import { ILogin } from "./type";
async function Login(data: ILogin): Promise<any> {
  return await api.post("auth/signin", data);
}

export { Login };
