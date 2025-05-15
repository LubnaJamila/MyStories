import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

export default class AddStoryView {
  render() {
    const container = document.getElementById("add-story-form-container");
    container.innerHTML = `
      <section class="container-form">
        <h1>Tambah Story</h1>
        <form id="storyForm">
          <label for="description">Deskripsi:</label>
          <textarea id="description" name="description" required></textarea>

          <label>Kamera atau Unggah Gambar:</label><br>
          <button type="button" id="cameraButton">Gunakan Kamera</button>
          <button type="button" id="captureButton" style="display:none;">Ambil Gambar</button>
          <video id="videoStream" width="100%" autoplay style="display:none;"></video>

          <div id="uploadSection">
            <label for="fileUpload">Unggah File:</label>
            <input type="file" id="fileUpload" accept="image/*">
          </div>
          <img id="previewImage" style="width: 50%; height: 400px; object-fit: cover; margin-top:10px; display:none;" />

          <label for="location">Lokasi:</label><br>
          <button type="button" id="getLocationBtn">Ambil Lokasi Saya</button>
          <div id="map" style="height: 400px; margin-top: 10px;"></div>
          <p id="locationText">Belum memilih lokasi</p>
          <p>Latitude: <span id="lat">-</span></p>
          <p>Longitude: <span id="lng">-</span></p>

          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  }

  async afterRender(submitCallback) {
    const form = document.getElementById("storyForm");
    const cameraButton = document.getElementById("cameraButton");
    const video = document.getElementById("videoStream");
    const captureButton = document.getElementById("captureButton");
    const fileUpload = document.getElementById("fileUpload");
    const previewImage = document.getElementById("previewImage");
    const getLocationBtn = document.getElementById("getLocationBtn");
    const latDisplay = document.getElementById("lat");
    const lngDisplay = document.getElementById("lng");
    const locationText = document.getElementById("locationText");
    const mapDiv = document.getElementById("map");

    let stream = null;
    let imageBlob = null;
    let map = null;
    let marker = null;
    let isLocationSelected = false;

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2x,
      iconUrl: markerIcon,
      shadowUrl: markerShadow,
    });

    const defaultLat = -6.2;
    const defaultLng = 106.816666;

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

    map = L.map(mapDiv, {
      center: [defaultLat, defaultLng],
      zoom: 13,
      layers: [osmLayer], 
    });

    const baseLayers = {
      "Peta Jalan (OpenStreetMap)": osmLayer,
      "Peta Terang (CartoDB Positron)": positronLayer,
      "Peta Satelit (Esri Imagery)": esriImageryLayer,
    };

    L.control.layers(baseLayers).addTo(map);

    marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

    marker.on("dragend", function (e) {
      const position = marker.getLatLng();
      latDisplay.textContent = position.lat.toFixed(6);
      lngDisplay.textContent = position.lng.toFixed(6);
      isLocationSelected = true;
      locationText.textContent = "Lokasi terpilih!";

      L.popup()
        .setLatLng(position)
        .setContent(
          `Latitude: ${position.lat.toFixed(
            6
          )}<br>Longitude: ${position.lng.toFixed(6)}`
        )
        .openOn(map);
    });

    map.on("click", function (e) {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      latDisplay.textContent = lat.toFixed(6);
      lngDisplay.textContent = lng.toFixed(6);
      isLocationSelected = true;
      locationText.textContent = "Lokasi terpilih!";

      L.popup()
        .setLatLng([lat, lng])
        .setContent(
          `Latitude: ${lat.toFixed(6)}<br>Longitude: ${lng.toFixed(6)}`
        )
        .openOn(map);
    });

    getLocationBtn.addEventListener("click", () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            latDisplay.textContent = lat.toFixed(6);
            lngDisplay.textContent = lng.toFixed(6);
            map.setView([lat, lng], 15);
            marker.setLatLng([lat, lng]);
            isLocationSelected = true;
            locationText.textContent = "Lokasi terpilih!";
          },
          () => alert("Gagal mendapatkan lokasi.")
        );
      } else {
        alert("Geolocation tidak didukung oleh browser Anda.");
      }
    });

    cameraButton.addEventListener("click", async () => {
      if (!stream) {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          video.srcObject = stream;
          video.style.display = "block";
          previewImage.style.display = "none";
          cameraButton.textContent = "Tutup Kamera";
          captureButton.style.display = "inline";
        } catch (err) {
          alert("Tidak dapat mengakses kamera.");
        }
      } else {
        stream.getTracks().forEach((track) => track.stop());
        video.style.display = "none";
        cameraButton.textContent = "Gunakan Kamera";
        captureButton.style.display = "none";
        stream = null;
      }
    });

    captureButton.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        imageBlob = blob;
        previewImage.src = URL.createObjectURL(blob);
        previewImage.style.display = "block";
        if (stream) stream.getTracks().forEach((track) => track.stop());
        video.style.display = "none";
        cameraButton.textContent = "Gunakan Kamera";
        captureButton.style.display = "none";
        stream = null;
      }, "image/jpeg");
    });

    fileUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 1048576) {
          alert("Ukuran gambar terlalu besar. Maksimal 1MB.");
          return;
        }
        imageBlob = file;
        const reader = new FileReader();
        reader.onload = (event) => {
          previewImage.src = event.target.result;
          previewImage.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const description = document.getElementById("description").value;
      const lat = isLocationSelected
        ? parseFloat(latDisplay.textContent)
        : null;
      const lng = isLocationSelected
        ? parseFloat(lngDisplay.textContent)
        : null;

      const data = new FormData();
      data.append("description", description);
      if (imageBlob) data.append("photo", imageBlob);
      if (lat && lng) {
        data.append("lat", lat); 
        data.append("lon", lng); 
      }

      submitCallback(data);
    });
  }
}
