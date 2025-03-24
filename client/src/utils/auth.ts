import { jwtDecode } from "jwt-decode";

export interface UserToken {
  username: string;
  id: number;
  iat: number;
  exp: number;
}

class AuthService {
  getProfile(): UserToken | null {
    const token = this.getToken();
    return token ? jwtDecode<UserToken>(token) : null;
  }

  loggedIn(): boolean {
    const token = this.getToken();
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

  getToken(): string | null{
    return localStorage.getItem("token");
  }

  login(token: string, setCurrentUser: (user: UserToken | null) => void) {
    localStorage.setItem("token", token);
    const user = jwtDecode<UserToken>(token);
    setCurrentUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  }

  logout(setCurrentUser: (user: UserToken | null) => void) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    localStorage.removeItem("problemResult");
    localStorage.removeItem("summaryResult");
  }
}

export default new AuthService();
