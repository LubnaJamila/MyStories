class HomePresenter {
  constructor({ view, model, storyModel }) {
    this._view = view;
    this._model = model;
    this._storyModel = storyModel;

    this._view.setOnStoryCardClickListener((id) => {
      this._showStoryDetails(id);
    });
  }

  async loadStories() {
    try {
      this._view.showLoadingIndicator(); 
      const result = await this._storyModel.getAllStories();

      if (result.error) {
        this._view.showLoadingError(result.message);
        return;
      }

      const stories = result.data;
      this._view.showStories(stories);
      this._view.initMap(stories);
    } catch (error) {
      this._view.showLoadingError("Terjadi kesalahan saat memuat cerita");
      console.error(error);
    }
  }

  async _showStoryDetails(id) {
    alert(`Detail cerita dengan ID: ${id} akan ditampilkan di sini`);
  }

  logout() {
    this._model.logout();
    window.location.href = "#/login";
  }
}

export default HomePresenter;
