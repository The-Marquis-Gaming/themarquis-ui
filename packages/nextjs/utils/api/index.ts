import axios from "axios";
import { getCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PRODUCTION_URL,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

export const fetchUserInfo = async () => {
  try {
    const response = await api.get("/user/info");
    return response.data;
  } catch (err) {
    throw new Error("Failed to fetch user info");
  }
};
