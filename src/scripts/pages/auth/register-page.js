import RegisterPresenter from "../../presenters/register-presenter";
import RegisterModel from "../../models/register-model";
import RegisterView from "../../views/register-view";
import AuthUtils from "../../utils/auth-utils";

class RegisterPage {
  constructor() {
    this._registerModel = new RegisterModel();
    this._registerView = new RegisterView();
    this._presenter = new RegisterPresenter({
      view: this._registerView,
      model: this._registerModel,
    });
  }

  async render() {
    return this._registerView.getTemplate();
  }

  async afterRender() {
    if (AuthUtils.isLoggedIn()) {
      window.location.href = "#/";
      return;
    }

    this._registerView.runWhenFormSubmitted((formData) => {
      this._presenter.register(formData);
    });
  }
}

export default RegisterPage;
