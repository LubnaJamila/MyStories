import NotFoundView from "../../views/notfound-view";

class NotFoundPage {
  async render() {
    return NotFoundView();
  }

  async afterRender() {
  }
}

export default NotFoundPage;
