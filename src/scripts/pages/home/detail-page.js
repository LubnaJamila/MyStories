import StoryModel from "../../models/story-model.js";
import DetailView from "../../views/detail-view.js";
import DetailPresenter from "../../presenters/detail-presenter.js";
import { parseActivePathname } from "../../routes/url-parser.js";

class DetailPage {
  async render() {
    return `
      <div id="storyDetailContainer"></div>
      <div id="map" style="height: 400px; margin-top: 20px; width: 50%"></div>
    `;
  }

  async afterRender() {
    const { id } = parseActivePathname();

    if (!id) {
      console.error("ID tidak ditemukan di URL");
      return;
    }

    const view = new DetailView();
    const model = new StoryModel(); 
    const presenter = new DetailPresenter({ view, model });

    await presenter.init(id);
  }
}

export default DetailPage;
