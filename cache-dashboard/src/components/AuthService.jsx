import axios from "axios";
import httpClient from "../httpClient";
import API_URL from "../constants"

class AuthService {
  login(email, password) {
    return httpClient.post(API_URL + "/auth/login", {
      email,
      password,
    })
  }

  logout() {
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    return httpClient.get(API_URL + "/auth/isauthenticated")
  }

  register(username, email, password) {
    return axios.post(API_URL + "/auth/register", {
      username,
      email,
      password,
    });
  };
}

export default new AuthService();