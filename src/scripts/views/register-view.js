class RegisterView {
  getTemplate() {
    return `
      <div class="auth-container">
        <h2 class="auth-title">Register</h2>
        <div id="messageContainer" class="message-container"></div>
        
        <form id="registerForm" class="auth-form">
          <div class="form-group">
            <label for="name">Nama</label>
            <input type="text" id="name" name="name" required>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required minlength="6">
          </div>
          
          <button type="submit" id="registerButton" class="auth-button">Daftar</button>
          
          <p class="auth-redirect">
            Sudah punya akun? <a href="#/login">Login di sini</a>
          </p>
        </form>
        
        <div id="loadingIndicator" class="loading-indicator hidden">
          <div class="spinner"></div>
        </div>
      </div>
    `;
  }

  runWhenFormSubmitted(handler) {
    const registerForm = document.querySelector("#registerForm");

    registerForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.querySelector("#name").value;
      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      handler({ name, email, password });
    });
  }

  showLoading() {
    document.querySelector("#loadingIndicator").classList.remove("hidden");
    document.querySelector("#registerButton").disabled = true;
  }

  hideLoading() {
    document.querySelector("#loadingIndicator").classList.add("hidden");
    document.querySelector("#registerButton").disabled = false;
  }

  showError(message) {
    const messageContainer = document.querySelector("#messageContainer");
    messageContainer.textContent = message;
    messageContainer.className = "message-container error show";

    setTimeout(() => {
      messageContainer.classList.remove("show");
    }, 3000);
  }

  showSuccess(message) {
    const messageContainer = document.querySelector("#messageContainer");
    messageContainer.textContent = message;
    messageContainer.className = "message-container success show";

    setTimeout(() => {
      messageContainer.classList.remove("show");
      window.location.href = "#/login";
    }, 2000);
  }

  redirectToLogin() {
    window.location.href = "#/login";
  }
}

export default RegisterView;
