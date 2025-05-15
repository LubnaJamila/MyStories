import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { saveStory } from "../data/db"; 

class DetailView {
  constructor() {
    this.container = document.getElementById("storyDetailContainer");
    this.mapContainer = document.getElementById("map");
  }

  showLoading() {
    this.container.innerHTML = "<p>Memuat detail cerita...</p>";
  }

  showError(message) {
    this.container.innerHTML = `<p class="error">Error: ${message}</p>`;
  }

  renderStory(story) {
    this.container.innerHTML = `
      <div class="story-detail">
        <h1>${story.name}</h1>
        <img src="${story.photoUrl}" alt="Foto ${
      story.name
    }" style="width:100%;max-width:600px;" />
        <p>${story.description}</p>
        ${
          story.lat && story.lon
            ? `<p><strong>Lokasi:</strong> Lat: ${story.lat.toFixed(
                4
              )}, Long: ${story.lon.toFixed(4)}</p>`
            : "<p>Lokasi tidak tersedia</p>"
        }
        <button id="save-offline-btn">Simpan Cerita Offline</button>
      </div>
    `;

    if (story.lat && story.lon) {
      this._renderMap(story.lat, story.lon, story.name);
    } else {
      this.mapContainer.style.display = "none";
    }

    const btnSave = document.getElementById("save-offline-btn");
    btnSave.addEventListener("click", () => {
      saveStory(story)
        .then(() => {
          window.location.href = "#/cerita-offline";
        })
        .catch((error) => {
          alert("Gagal menyimpan cerita offline: " + error.message);
        });
    });
  }

  _renderMap(lat, lon, name) {
    this.mapContainer.style.display = "block";
    if (this.map) {
      this.map.remove();
    }

    this.mapContainer.style.height = "400px";

    this.map = L.map(this.mapContainer).setView([lat, lon], 13);

    const osmLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
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
        "Peta Dasar (OpenStreetMap)": osmLayer,
        "Peta Terang (CartoDB Positron)": positronLayer,
        "Peta Satelit (Esri Imagery)": esriImageryLayer,
      })
      .addTo(this.map);

    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup(`<b>${name}</b>`)
      .openPopup();

    osmLayer.addTo(this.map);
  }
}

export default DetailView;
