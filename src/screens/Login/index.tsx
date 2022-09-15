import React, { useState, useEffect } from "react";
/** Componets */
import { CustomButton, Card } from "../../components";
/** Helper */
import { fetchHelper, Storage } from "../../helper";
/** React Rotuer */
import { useNavigate, Navigate } from "react-router-dom";
/** SweetAlert */
import Swal from "sweetalert2";
/** Image */
import googleIcon from "../../assets/google_icon.webp";

interface Props {}

const Login: React.FC<Props> = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [button, setButton] = useState<string>("");

  useEffect(() => {
    handleTokenFromQueryParams();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const data = {
        token: sessionStorage.getItem("accessToken"),
        refreshToken: sessionStorage.getItem("refreshToken"),
      };

      (async () => {
        try {
          const response = await fetchHelper(
            `${process.env.REACT_APP_BASE_URL}/user/verify`,
            "POST",
            data
          );

          if (response) {
            Storage.set("data", response);

            navigate("/manage");
          } else {
            throw "Something wrong when Logging in";
          }
        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Authentication Failed",
            text: error,
            timer: 2000,
          });
        }
      })();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has("code")) {
      (async () => {
        Swal.fire({
          title: "Installing Slack Drive on your workspace",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        const code = params.get("code");
        const request = await fetchHelper(
          `${process.env.REACT_APP_BASE_URL}/user/slackAuth?code=${code}`,
          "POST"
        );
        Swal.close();
      })();
    } else {
      setButton("Google");
    }
  }, []);

  const handleGoogleResponse = async () => {
    try {
      const authLink = await fetchHelper(
        `${process.env.REACT_APP_BASE_URL}/user/authlink`,
        "POST"
      );

      window.location.href = authLink;
    } catch (error) {
      console.log(error);
    }
  };

  const handleTokenFromQueryParams = () => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const expirationDate = newExpirationDate();
    console.log("App.js 30 | expiration Date", expirationDate);
    if (accessToken && refreshToken) {
      storeTokenData(accessToken, refreshToken, expirationDate);
      setIsLoggedIn(true);
    }
  };

  const newExpirationDate = () => {
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return expiration;
  };

  const storeTokenData = async (
    token: string,
    refreshToken: string,
    expirationDate: any
  ) => {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("expirationDate", expirationDate);
  };

  return (
    <div className="w-screen h-screen bg-gray-300">
      <div className="w-full h-full flex flex-wrap justify-center items-center">
        <Card style="shadow-md shadow-gray-800 rounded-md bg-slate-900">
          <div className="py-8 px-36 flex flex-col justify-center items-center">
            <h1 className="text-white mb-8 font-bold text-2xl">
              Welcome to Slack Drive
            </h1>
            <CustomButton
              style="py-1 px-3 rounded bg-white font-bold flex flex-wrap items-center"
              action={handleGoogleResponse}
            >
              <img src={googleIcon} className="w-10 h-10" />
              <span className="mr-2">Sign In With Google</span>
            </CustomButton>
            <h1 className="text-white mt-8 font-semibold text-base tracking-wider">
              Made and Develope by{" "}
              <span className="font-bold text-blue-500">Strata</span>
            </h1>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
