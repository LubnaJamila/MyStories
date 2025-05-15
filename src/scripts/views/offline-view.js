class OfflineView {
  constructor() {
    this.offlineGrid = null;
    this.onDeleteClick = () => {};
  }

  init() {
    this.offlineGrid = document.getElementById("offlineStoryGrid");
    console.log("Offline grid initialized:", this.offlineGrid);
  }

  setOnDeleteClickListener(callback) {
    this.onDeleteClick = callback;
  }

  showLoading() {
    if (this.offlineGrid) {
      this.offlineGrid.innerHTML = `<div class="loading">Memuat cerita offline...</div>`;
    }
  }

  showError(message) {
    if (this.offlineGrid) {
      this.offlineGrid.innerHTML = `<div class="error-state">Error: ${message}</div>`;
    }
  }

  showStories(stories) {
    if (!this.offlineGrid) return;
    this.offlineGrid.innerHTML = "";

    if (stories.length === 0) {
      this.offlineGrid.innerHTML = `<div class="empty-state">Tidak ada cerita offline tersimpan</div>`;
      return;
    }

    stories.forEach((story) => {
      const card = this._createStoryCard(story);
      this.offlineGrid.appendChild(card);
    });
  }

  _createStoryCard(story) {
    const el = document.createElement("div");
    el.classList.add("story-card");
    el.dataset.id = story.id;

    if (navigator.onLine && story.photoUrl) {
      el.innerHTML = `
        <div class="story-image">
          <img src="${story.photoUrl}" alt="${story.name}" loading="lazy" />
        </div>
        <div class="story-content">
          <h3>${story.name}</h3>
          <p>${this._truncateText(story.description, 100)}</p>
        </div>
        <button class="delete-btn">Hapus</button>
      `;
    } else {
      el.innerHTML = `
        <div class="story-content" style="padding: 16px;">
          <h3>${story.name}</h3>
          <p>${this._truncateText(story.description, 100)}</p>
        </div>
        <button class="delete-btn">Hapus</button>
      `;
    }

    el.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      if (this.onDeleteClick) this.onDeleteClick(story.id);
    });

    return el;
  }

  _truncateText(text, maxLength) {
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  }
}

export default OfflineView;
