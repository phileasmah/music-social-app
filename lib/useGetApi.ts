const useGetApi = async (token: string, url: string, body: object = {}) => {
  const axios = require("axios");
  try {
    const response = await axios.get("https://api.spotify.com/v1/" + url, {
      headers: { Authorization: "Bearer " + token },
      data: body,
    });
    return response.data;
  } catch (e) {
    throw e;
  }
};

export default useGetApi;
