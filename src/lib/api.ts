import axios from "axios";

export const BASE_URL: string = import.meta.env.VITE_API_BASE_URL!;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export default api;
