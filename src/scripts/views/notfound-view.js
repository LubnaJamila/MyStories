// src/views/notfound-view.js
const NotFoundView = () => {
  return `
        <section class="not-found">
          <div class="not-found-container">
            <h1 class="not-found-title">404</h1>
            <h2 class="not-found-subtitle">Halaman Tidak Ditemukan</h2>
            <p class="not-found-description">Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.</p>
            <a href="#/" class="back-button">Kembali ke Beranda</a>
          </div>
        </section>
      `;
};

export default NotFoundView;
