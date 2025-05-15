import CONFIG from "../config";

class AddStoryModel {
  static ADD_STORY_ENDPOINT = `${CONFIG.BASE_URL}/stories`;

  async submitStory(formData, token) {
    if (!navigator.onLine) {
      return {
        error: true,
        message: "Anda sedang offline, tidak dapat menambahkan cerita.",
      };
    }

    try {
      const response = await fetch(AddStoryModel.ADD_STORY_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return { error: true, message: "Terjadi kesalahan saat mengirim data." };
    }
  }
}

export default AddStoryModel;
