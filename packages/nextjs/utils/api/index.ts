import axios from "axios";

const api = axios.create({
  baseURL: "http://0.0.0.0:8080/",
  withCredentials: false,
});

export default api;
