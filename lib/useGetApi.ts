import { AxiosResponse } from "axios";

const useGetApi = async <T>(token: string, url: string, body: object = {}) : Promise<AxiosResponse<T>> => {
  const axios = require("axios");
  const response = await axios.get("https://api.spotify.com/v1/" + url, {
    headers: { Authorization: "Bearer " + token },
    data: body,
  });
  return response;
};

export default useGetApi;
