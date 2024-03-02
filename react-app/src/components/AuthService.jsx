import axios from "axios";

const API_URL = "http://localhost:8000/api/auth/";

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + "login", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  isAuthenticated() {
    const token = localStorage.getItem("user");
    // Check if token exists and is not expired
    if (token) {
      return true;
    }
    return false;
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