import AuthUtils from "../utils/auth-utils";

class LoginPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async login({ email, password }) {
    try {
      this._view.showLoading();
      const response = await this._model.login({ email, password });

      AuthUtils.saveAuth({
        token: response.loginResult.token,
        name: response.loginResult.name,
      });

      this._view.redirectToHome();
    } catch (error) {
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default LoginPresenter;
