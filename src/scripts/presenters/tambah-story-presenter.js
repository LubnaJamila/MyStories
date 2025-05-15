import AddStoryView from "../views/tambah-story-view";
import AddStoryModel from "../models/tambah-story-model";
import AuthUtils from "../utils/auth-utils";

class AddStoryPresenter {
  constructor() {
    this.view = new AddStoryView();
    this.model = new AddStoryModel();
  }

  async init() {
    this.view.render();
    await this.view.afterRender((formData) => this.handleSubmit(formData));
    this.checkLogin();
  }

  checkLogin() {
    if (!AuthUtils.isLoggedIn()) {
      alert("Anda belum login. Silakan login terlebih dahulu.");
      window.location.href = "/#/login";
    }
  }

  async handleSubmit(formData) {
    const auth = AuthUtils.getAuth();
    if (!auth) {
      alert("Anda harus login untuk mengirim story.");
      return;
    }

    try {
      const result = await this.model.submitStory(formData, auth.token);
      if (result.error) {
        alert(`Gagal: ${result.message}`);
      } else {
        alert("Story berhasil ditambahkan!");
        window.location.href = "/#";
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mengirim story.");
    }
  }
}

export default AddStoryPresenter;
