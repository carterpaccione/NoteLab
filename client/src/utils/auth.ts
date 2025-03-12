import { jwtDecode } from "jwt-decode";

export interface UserToken {
  username: string;
  id: number;
  iat: number;
  exp: number;
}

class AuthService {
  getProfile() {
    return jwtDecode<UserToken>(this.getToken() || "");
  }

  loggedIn() {
    const token = localStorage.getItem("token");
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("token");
  }

  login(token: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(jwtDecode<UserToken>(token)));
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("problemResult");
    localStorage.removeItem("summaryResult");
  }
}

export default new AuthService();
