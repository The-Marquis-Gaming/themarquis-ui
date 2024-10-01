import { deleteCookie } from "cookies-next";
import api from ".";
async function Logout(): Promise<any> {
  try {
    await api.post("auth/logout");
    deleteCookie("accessToken");
    return { success: true };
  } catch (err) {
    throw new Error("Logout failure");
  }
}

export { Logout };
