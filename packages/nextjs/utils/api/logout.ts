import api from ".";
import { logout } from "./type";
async function Logout(data: logout): Promise<any> {
  return await api.post("auth/logout", data);
}

export { Logout };
