import AddStoryPresenter from "../../presenters/tambah-story-presenter";

export default class AddStoryPage {
  async render() {
    return `
      <section class="container">
        <div id="add-story-form-container"></div>
      </section>
    `;
  }

  async afterRender() {
    const presenter = new AddStoryPresenter();
    await presenter.init();
  }
}
