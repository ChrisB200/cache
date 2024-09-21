import httpClient from "../utils/httpClient";
import {BASE_API_URL} from "../utils/constants";

class AuthService {
  login(email, password) {
    return httpClient.post(`${BASE_API_URL}/login`, {
      email,
      password,
    });
  }

  logout() {
    return httpClient.post(`${BASE_API_URL}/logout`, {});
  }

  is_authenticated() {
    return httpClient.get(`${BASE_API_URL}/is_authenticated`);
  }

  signup(email, password, fguser, fgpass, sduser, sdpass) {
    return httpClient.post(`${BASE_API_URL}/signup`, {
      email,
      password,
      fguser,
      fgpass,
      sduser,
      sdpass,
    });
  }

  is_user(email) {
    return httpClient.post(`${BASE_API_URL}/is_user`, { email });
  }
}

export default new AuthService();
