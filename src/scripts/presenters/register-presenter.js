class RegisterPresenter {
  constructor({ view, model }) {
    this._view = view;
    this._model = model;
  }

  async register({ name, email, password }) {
    try {
      this._view.showLoading();
      await this._model.register({ name, email, password });
      this._view.showSuccess("Registrasi berhasil! Silakan login.");
    } catch (error) {
      this._view.showError(error.message);
    } finally {
      this._view.hideLoading();
    }
  }
}

export default RegisterPresenter;
