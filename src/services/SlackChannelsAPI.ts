/** Helper */
import { fetchHelper, Storage } from "../helper";

class SlackChannelsAPI {
  static async getList(id: number) {
    try {
      const response = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/channels/list/${id}`,
        "GET"
      );

      return response;
    } catch (error) {
      console.log(error);
    }
  }
  static async getMembers(channelId: string) {
    try {
    } catch (error) {
      console.log(error);
    }
  }
}

export default SlackChannelsAPI;
