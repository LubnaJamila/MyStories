import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

class HomeView {
  constructor(userName) {
    this._map = null;
    this._markers = [];
    this.onStoryCardClick = () => {};
  }

  getTemplate() {
    return `
      <div class="home-container">
        <div class="welcome-section">
          <p>Berikut adalah cerita terbaru dari pengguna</p>
        </div>
        
        <div class="story-grid" id="storyGrid">
          <div class="loading">Memuat cerita...</div>
        </div>
        
        <div class="map-container">
          <h2>Lokasi Cerita</h2>
          <div id="map" style="width: 100%; height: 400px;"></div>
        </div>
      </div>
    `;
  }

  showLoadingIndicator() {
    const storyGrid = document.querySelector("#storyGrid");
    if (storyGrid) {
      storyGrid.innerHTML = `<div class="loading">Memuat cerita...</div>`;
    }
  }

  showStories(stories) {
    const storyGrid = document.querySelector("#storyGrid");
    storyGrid.innerHTML = "";

    if (stories.length === 0) {
      storyGrid.innerHTML = `<div class="empty-state">Tidak ada cerita yang tersedia</div>`;
      return;
    }

    stories.forEach((story) => {
      const storyCard = this._createStoryCard(story);
      storyGrid.appendChild(storyCard);
    });
  }

  _createStoryCard(story) {
    const storyElement = document.createElement("div");
    storyElement.classList.add("story-card");
    storyElement.dataset.id = story.id;

    storyElement.innerHTML = `
      <div class="story-image">
        <img src="${story.photoUrl}" alt="${story.name}'s story" loading="lazy">
      </div>
      <div class="story-content">
        <h3>${story.name}</h3>
        <p class="story-desc">${this._truncateText(story.description, 100)}</p>
        ${
          story.lat && story.lon
            ? `<p class="story-location"><i class="location-icon">📍</i> Lat: ${story.lat.toFixed(
                4
              )}, Long: ${story.lon.toFixed(4)}</p>`
            : ""
        }
      </div>
    `;

    storyElement.addEventListener("click", () => {
      window.location.href = `#/detail/${story.id}`;
    });

    return storyElement;
  }

  _truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  initMap(stories) {
    this._setupMap(stories);
  }

  _setupMap(stories) {
    const mapElement = document.getElementById("map");

    if (this._map) {
      this._map.remove();
      this._markers = [];
    }

    let centerLat = -6.2088;
    let centerLon = 106.8456;

    const storyWithLocation = stories.find((story) => story.lat && story.lon);
    if (storyWithLocation) {
      centerLat = storyWithLocation.lat;
      centerLon = storyWithLocation.lon;
    }

    this._map = L.map(mapElement).setView([centerLat, centerLon], 10);

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );

    const positronLayer = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles by <a href="https://carto.com">CartoDB</a>',
      }
    );

    const esriImageryLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoIQ, NOAA",
      }
    );

    L.control
      .layers({
        "Peta Jalan (OpenStreetMap)": osmLayer,
        "Peta Terang (CartoDB Positron)": positronLayer,
        "Peta Satelit (Esri Imagery)": esriImageryLayer,
      })
      .addTo(this._map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this._map)
          .bindPopup(`
            <div class="marker-popup">
              <h4>${story.name}</h4>
              <img src="${story.photoUrl}" alt="${
          story.name
        }" style="width:100%;max-height:150px;object-fit:cover;">
              <p>${this._truncateText(story.description, 50)}</p>
            </div>
          `);

        this._markers.push(marker);
      }
    });

    osmLayer.addTo(this._map);
  }

  setOnStoryCardClickListener(callback) {
    this.onStoryCardClick = callback;
  }

  showLoadingError(message) {
    const storyGrid = document.querySelector("#storyGrid");
    storyGrid.innerHTML = `<div class="error-state">Error: ${message}. Silakan coba lagi nanti.</div>`;
  }
}

export default HomeView;
