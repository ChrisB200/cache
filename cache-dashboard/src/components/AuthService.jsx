import axios from "axios";
import httpClient from "../httpClient";

const API_URL = "http://localhost:8000/api/auth/";

class AuthService {
  login(email, password) {
    return httpClient.post(API_URL + "login", {
      email,
      password,
    })
  }

  logout() {
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    return httpClient.get(API_URL + "isauthenticated")
  }

  register(username, email, password) {
    return axios.post(API_URL + "register", {
      username,
      email,
      password,
    });
  };
}

export default new AuthService();