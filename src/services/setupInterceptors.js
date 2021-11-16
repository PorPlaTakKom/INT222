import axiosInstance from "./api";
import TokenService from "./token.service";
import { refreshToken } from "../actions/auth/auth";
import axios from "axios";

const setup = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers["Authorization"] = 'INK'+token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  const { dispatch } = store;
  axiosInstance.interceptors.response.use(
    (res) => {
      return res;
    },
    async (err) => {
      const originalConfig = err.config;
      if (originalConfig.url !== "login" && err.response) {
        // Access Token was expired
        if (err.response.status === 401 && !originalConfig._retry) {
          originalConfig._retry = true;
          try {
            let newToken;
            const refreshTokenOld = await "INK" + TokenService.getLocalRefreshToken()
            await axios.get("https://www.tarkom-projects.com/api/v1/token/refresh", {headers: {Authorization: refreshTokenOld}})
                .then(res => {
                  newToken = res.data
                })
            await dispatch(refreshToken(newToken));
            await TokenService.updateLocalAccessToken(newToken);
            return axiosInstance(originalConfig);
          } catch (_error) {
            return Promise.reject(_error);
          }
        }
      }
      return Promise.reject(err);
    }
  );
};
export default setup;
