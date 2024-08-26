import httpClient, { BASE_API_URL } from "./httpClient";

class AuthService {
  login(email, password) {
    return httpClient.post(`${BASE_API_URL}/auth/login`, {
      email,
      password,
    });
  }

  logout() {
    return httpClient.post(`${BASE_API_URL}/auth/logout`, {});
  }

  is_authenticated() {
    return httpClient.get(`${BASE_API_URL}/auth/is_authenticated`);
  }

  signup(email, password, fguser, fgpass, sduser, sdpass) {
    return httpClient.post(`${BASE_API_URL}/auth/signup`, {
      email,
      password,
      fguser,
      fgpass,
      sduser,
      sdpass,
    });
  }

  is_user(email) {
    return httpClient.post(`${BASE_API_URL}/auth/is_user`, { email });
  }
}

export default new AuthService();
