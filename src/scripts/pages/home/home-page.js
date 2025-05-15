import HomeView from "../../views/home-view";
import HomeModel from "../../models/home-model";
import StoryModel from "../../models/story-model";
import HomePresenter from "../../presenters/home-presenter";

class HomePage {
  constructor() {
    this._homeModel = new HomeModel();
    this._storyModel = new StoryModel();
    const userInfo = this._homeModel.getUserInfo();

    this._homeView = new HomeView(userInfo ? userInfo.name : null);
    this._homePresenter = new HomePresenter({
      view: this._homeView,
      model: this._homeModel,
      storyModel: this._storyModel,
    });
  }

  async render() {
    return this._homeView.getTemplate();
  }

  async afterRender() {
    await this._homePresenter.loadStories();
  }
}

export default HomePage;
