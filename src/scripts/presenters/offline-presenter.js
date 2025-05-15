import { getAllStories, deleteStory } from "../data/db.js";
import OfflineView from "../views/offline-view.js";

class OfflinePresenter {
  constructor() {
    this.view = new OfflineView();

    this.view.setOnDeleteClickListener(this.handleDeleteStory.bind(this)); 
  }

  async init() {
    this.view.init();
    this.view.showLoading();

    try {
      const stories = await getAllStories();
      console.log("Cerita offline dari IndexedDB:", stories);
      this.view.showStories(stories);
    } catch (error) {
      this.view.showError("Gagal memuat cerita offline");
      console.error(error);
    }
  }


  async handleDeleteStory(storyId) {
    const confirmDelete = confirm(
      "Apakah kamu yakin ingin menghapus cerita ini?"
    );
    if (!confirmDelete) return;

    try {
      await deleteStory(storyId);
      alert("Cerita berhasil dihapus.");

      const stories = await getAllStories();
      this.view.showStories(stories);
    } catch (error) {
      alert("Gagal menghapus cerita: " + error.message);
      console.error(error);
    }
  }
}

export default OfflinePresenter;
