import HomePage from "../pages/home/home-page";
import LoginPage from "../pages/auth/login-page";
import RegisterPage from "../pages/auth/register-page";
import AddStoryPage from "../pages/tambah-story/tambah-story-page";
import DetailPage from "../pages/home/detail-page";
import OfflinePage from "../pages/cerita-offline/offline-page";
import NotFoundPage from "../pages/notfound/notfound-page";

const routes = {
  "/": new HomePage(),
  "/login": new LoginPage(),
  "/register": new RegisterPage(),
  "/tambah-story": new AddStoryPage(),
  "/detail/:id": new DetailPage(),
  "/cerita-offline": new OfflinePage(),
  "*" : new NotFoundPage(),
};

export default routes;
