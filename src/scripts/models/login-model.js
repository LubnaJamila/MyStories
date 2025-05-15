import CONFIG from "../config";

class LoginModel {
  static AUTH_KEY = "auth";
  static LOGIN_ENDPOINT = `${CONFIG.BASE_URL}/login`;

  async login({ email, password }) {
    const response = await fetch(LoginModel.LOGIN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  }

  saveAuth({ token, name }) {
    localStorage.setItem(LoginModel.AUTH_KEY, JSON.stringify({ token, name }));
  }

  getAuth() {
    const auth = localStorage.getItem(LoginModel.AUTH_KEY);
    return auth ? JSON.parse(auth) : null;
  }

  isLoggedIn() {
    return !!this.getAuth();
  }
}

export default LoginModel;
