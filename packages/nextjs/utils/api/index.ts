import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API,
  withCredentials: false,
});

export default api;
