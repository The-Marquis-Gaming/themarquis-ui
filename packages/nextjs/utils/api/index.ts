import axios from "axios";

const api = axios.create({
  baseURL: "http://0.0.0.0:8080/",
  withCredentials: false,
});

export const fetchUserInfo = async (token: string) => {
  const response = await api.get("/user/info", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default api;
