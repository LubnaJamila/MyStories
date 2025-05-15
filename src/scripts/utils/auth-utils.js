class AuthUtils {
  static AUTH_KEY = "auth";

  static saveAuth({ token, name }) {
    localStorage.setItem(AuthUtils.AUTH_KEY, JSON.stringify({ token, name }));
  }

  static getAuth() {
    const auth = localStorage.getItem(AuthUtils.AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  }

  static destroyAuth() {
    localStorage.removeItem(AuthUtils.AUTH_KEY);
  }

  static isLoggedIn() {
    return !!this.getAuth();
  }
}

export default AuthUtils;
