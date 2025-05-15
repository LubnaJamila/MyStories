import CONFIG from "../config";
import AuthUtils from "../utils/auth-utils";

class StoryModel {
  async getAllStories() {
    try {
      if (!navigator.onLine) {
        return { error: true, message: "Tidak ada koneksi internet" };
      }

      const auth = AuthUtils.getAuth();

      if (!auth || !auth.token) {
        return { error: true, message: "Token autentikasi tidak ditemukan" };
      }

      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        return { error: true, message: responseJson.message };
      }

      return { error: false, data: responseJson.listStory };
    } catch (error) {
      return { error: true, message: "Terjadi kesalahan saat mengambil data" };
    }
  }

  async getStoryDetail(id) {
    try {
      if (!navigator.onLine) {
        return { error: true, message: "Tidak ada koneksi internet" };
      }

      const auth = AuthUtils.getAuth();

      if (!auth || !auth.token) {
        return { error: true, message: "Token autentikasi tidak ditemukan" };
      }

      const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      const responseJson = await response.json();

      if (responseJson.error) {
        return { error: true, message: responseJson.message };
      }

      return { error: false, data: responseJson.story };
    } catch (error) {
      return {
        error: true,
        message: "Terjadi kesalahan saat mengambil detail story",
      };
    }
  }
}

export default StoryModel;
