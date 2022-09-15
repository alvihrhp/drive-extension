import { fetchHelper } from "../helper";

class WorkspaceAPI {
  static async getAll(userId: number) {
    try {
      const response = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/workspace/${userId}`,
        "GET"
      );

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default WorkspaceAPI;
