class LoginView {
  getTemplate() {
    return `
      <div class="auth-container">
        <h2 class="auth-title">Login</h2>
        <div id="errorContainer" class="error-container"></div>
        
        <form id="loginForm" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
          </div>
          
          <button type="submit" id="loginButton" class="auth-button">Login</button>
          
          <p class="auth-redirect">
            Belum punya akun? <a href="#/register">Daftar di sini</a>
          </p>
        </form>
        
        <div id="loadingIndicator" class="loading-indicator hidden">
          <div class="spinner"></div>
        </div>
      </div>
    `;
  }

  runWhenFormSubmitted(handler) {
    const loginForm = document.querySelector("#loginForm");

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;

      handler({ email, password });
    });
  }

  showLoading() {
    document.querySelector("#loadingIndicator").classList.remove("hidden");
    document.querySelector("#loginButton").disabled = true;
  }

  hideLoading() {
    document.querySelector("#loadingIndicator").classList.add("hidden");
    document.querySelector("#loginButton").disabled = false;
  }

  showError(message) {
    const errorContainer = document.querySelector("#errorContainer");
    errorContainer.textContent = message;
    errorContainer.classList.add("show");

    setTimeout(() => {
      errorContainer.classList.remove("show");
    }, 3000);
  }

  redirectToHome() {
    window.location.href = "#/";
  }
}

export default LoginView;
