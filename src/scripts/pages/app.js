import NotificationModel from "../models/notifications-model";
import AuthUtils from "../utils/auth-utils";
import { getActiveRoute, getActivePathname } from "../routes/url-parser";
import routes from "../routes/routes";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #navList = null;
  #notificationModel = null;

  constructor({ navigationDrawer, drawerButton, content, navList }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;
    this.#navList = navList;

    this.#notificationModel = new NotificationModel();
    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const pathname = getActivePathname();
    let page = routes[url];

    if (!page) {
      console.log(`Page not found for route: ${pathname}`);
      page = routes["*"];
      this._renderNotFoundPage(page);
      return;
    }

    if (
      !AuthUtils.isLoggedIn() &&
      url !== "/login" &&
      url !== "/register" &&
      url !== "*"
    ) {
      window.location.href = "#/login";
      return;
    }

    this._updateNavigationItems();

    if ("startViewTransition" in document) {
      const transition = document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });

      await transition.finished;
    } else {
      this.#content.classList.remove("visible");
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      setTimeout(() => {
        this.#content.classList.add("visible");
      }, 50);
    }
  }

  _updateNavigationItems() {
    const isLoggedIn = AuthUtils.isLoggedIn();
    const auth = AuthUtils.getAuth();

    if (this.#navList) {
      this.#navList.innerHTML = "";

      if (isLoggedIn) {
        const userNameItem = document.createElement("li");
        userNameItem.classList.add("user-info");
        userNameItem.textContent = `Halo, ${auth.name}`;

        const button = document.createElement("button");
        let isActive = this.#notificationModel.checkLocalSubscriptionStatus();

        button.textContent = isActive ? "Nonaktifkan" : "Aktifkan";
        button.classList.add("notification-btn");
        button.classList.add(isActive ? "active" : "inactive");

        button.addEventListener("click", async () => {
          isActive = !isActive;

          if (isActive) {
            button.textContent = "Nonaktifkan";
            button.classList.remove("inactive");
            button.classList.add("active");
            console.log("Fitur diaktifkan!");
            await this.#notificationModel.subscribe();
          } else {
            button.textContent = "Aktifkan";
            button.classList.remove("active");
            button.classList.add("inactive");
            console.log("Fitur dinonaktifkan!");
            await this.#notificationModel.unsubscribe();
          }

          this.#notificationModel.setLocalSubscriptionStatus(isActive);
        });

        userNameItem.appendChild(button);
        this.#navList.appendChild(userNameItem);

        const homeItem = document.createElement("li");
        homeItem.innerHTML = '<a href="#/">Beranda</a>';
        this.#navList.appendChild(homeItem);

        const aboutItem = document.createElement("li");
        aboutItem.innerHTML = '<a href="#/tambah-story">Tambah Story</a>';
        this.#navList.appendChild(aboutItem);

        const offlineStoryItem = document.createElement("li");
        offlineStoryItem.innerHTML =
          '<a href="#/cerita-offline">Cerita Offline</a>';
        this.#navList.appendChild(offlineStoryItem);

        const logoutItem = document.createElement("li");
        const logoutLink = document.createElement("a");
        logoutLink.setAttribute("href", "#");
        logoutLink.textContent = "Logout";
        logoutLink.addEventListener("click", (event) => {
          event.preventDefault();
          AuthUtils.destroyAuth();
          window.location.href = "#/login";
        });
        logoutItem.appendChild(logoutLink);
        this.#navList.appendChild(logoutItem);
      } else {
        const loginItem = document.createElement("li");
        loginItem.innerHTML = '<a href="#/login">Login</a>';
        this.#navList.appendChild(loginItem);

        const registerItem = document.createElement("li");
        registerItem.innerHTML = '<a href="#/register">Register</a>';
        this.#navList.appendChild(registerItem);
      }
    }
  }

  async _renderNotFoundPage(page) {
    this._updateNavigationItems();

    if ("startViewTransition" in document) {
      const transition = document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
      });

      await transition.finished;
    } else {
      this.#content.classList.remove("visible");
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      setTimeout(() => {
        this.#content.classList.add("visible");
      }, 50);
    }
  }
}

export default App;
