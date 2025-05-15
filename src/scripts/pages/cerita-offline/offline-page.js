import OfflinePresenter from "../../presenters/offline-presenter";

class OfflinePage {
  constructor() {
    this.presenter = new OfflinePresenter();
  }

  async render() {
    return `
      <section class="offline-section">
        <h2>Cerita Offline</h2>
        <div id="offlineStoryGrid" class="card-container"></div>
      </section>
    `;
  }

  async afterRender() {
    await this.presenter.init();
  }
}

export default OfflinePage;
