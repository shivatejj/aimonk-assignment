import axios from "axios";

const api = axios.create({
  baseURL: "https://aimonk-backend.onrender.com",
});

export default api;