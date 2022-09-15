/** Helper */
import { fetchHelper, Storage } from "../helper";

class DriveAPI {
  static async get(params: any) {
    try {
      const response = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/drive/list?token=${params.token}`,
        "GET"
      );

      const newResponse: { [key: string]: any }[] = response.map(
        (response: { [key: string]: any }) => {
          return {
            ...response,
            isActive: false,
            folders: [],
          };
        }
      );

      return newResponse;
    } catch (error) {
      console.log(error);
    }
  }
  static async getSub(params: any, body: any) {
    try {
      const response = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/drive/sublist?folder_id=${params.folder_id}&token=${params.token}`,
        "GET"
      );

      const newResponse: { [key: string]: any }[] = response.map(
        (response: { [key: string]: any }) => {
          const newData: any = {
            ...response,
            isActive: false,
            parent: [...params.parentFolder],
            folders: [],
          };

          return newData;
        }
      );

      return newResponse;
    } catch (error) {
      console.log(error);
    }
  }
  static async put(params: any, body: any) {
    try {
      const response = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/drive/connect?by=${params.query}`,
        "PUT",
        body
      );

      return response;
    } catch (error: any) {
      throw error.error;
    }
  }
  static async disconnect(body: any) {
    try {
      const response = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/drive/disconnect`,
        "PUT",
        body
      );

      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

export default DriveAPI;
