class DetailPresenter {
  constructor({ view, model }) {
    this.view = view;
    this.model = model;
  }

  async init(id) {
    this.view.showLoading();
    try {
      const response = await this.model.getStoryDetail(id);

      if (response.error) {
        this.view.showError(response.message);
        return;
      }

      this.view.renderStory(response.data);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}

export default DetailPresenter;
