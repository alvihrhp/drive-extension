import { fetchHelper } from "../helper";

class UserApi {
  static async loginSuccess() {
    try {
      const data = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/user/verify/success`,
        "GET"
      );

      return data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserApi;
