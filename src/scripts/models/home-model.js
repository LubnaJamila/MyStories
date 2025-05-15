import AuthUtils from "../utils/auth-utils";

class HomeModel {
  getUserInfo() {
    return AuthUtils.getAuth();
  }

  logout() {
    AuthUtils.destroyAuth();
  }
}

export default HomeModel;
