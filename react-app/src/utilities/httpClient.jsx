import axios from "axios";

export const BASE_API_URL = "http://localhost:8080/api"

export default axios.create({
  withCredentials: true,
});
