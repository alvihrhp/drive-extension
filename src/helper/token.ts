import fetchHelper from "./fetchHelper";

export const getToken = async () => {
  if (tokenExpired()) {
    const refreshtoken = sessionStorage.getItem("refreshToken");
    const token = await getValidTokenFromServer(refreshtoken);
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("expirationDate", String(newExpirationDate()));
    return token;
  } else {
    return sessionStorage.getItem("accessToken");
  }
};

const newExpirationDate = () => {
  var expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  return expiration;
};

const tokenExpired = () => {
  const now = new Date();

  const expirationDate: any = sessionStorage.getItem("expirationDate");
  const expDate = new Date(expirationDate);

  if (now.getTime() > expDate.getTime()) {
    return true; // token expired
  }

  return false; // valid token
};

const getValidTokenFromServer = async (refreshToken: any) => {
  // get new token from server with refresh token
  try {
    const data = {
      refreshToken,
    };

    const token = await fetchHelper(
      "http://localhost:8000/api/v1/user/getValidToken",
      "POST",
      data
    );

    return token;
  } catch (error: any) {
    throw error.message;
  }
};
