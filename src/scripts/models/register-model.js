import CONFIG from "../config";

class RegisterModel {
  static REGISTER_ENDPOINT = `${CONFIG.BASE_URL}/register`;

  async register({ name, email, password }) {
    const response = await fetch(RegisterModel.REGISTER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const responseJson = await response.json();

    if (!response.ok) {
      throw new Error(responseJson.message);
    }

    return responseJson;
  }
}

export default RegisterModel;
