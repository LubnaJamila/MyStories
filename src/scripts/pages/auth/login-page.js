import LoginPresenter from "../../presenters/login-presenter";
import LoginModel from "../../models/login-model";
import LoginView from "../../views/login-view";
import AuthUtils from "../../utils/auth-utils";

class LoginPage {
  constructor() {
    this._loginModel = new LoginModel();
    this._loginView = new LoginView();
    this._presenter = new LoginPresenter({
      view: this._loginView,
      model: this._loginModel,
    });
  }

  async render() {
    return this._loginView.getTemplate();
  }

  async afterRender() {
    if (AuthUtils.isLoggedIn()) {
      window.location.href = "#/";
      return;
    }

    this._loginView.runWhenFormSubmitted((formData) => {
      this._presenter.login(formData);
    });
  }
}

export default LoginPage;
