import api from ".";
async function Logout(): Promise<any> {
  return await api.post("auth/logout");
}

export { Logout };
