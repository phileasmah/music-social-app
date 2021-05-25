import { Provider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import { useEffect, useMemo, useState } from "react";
import { ApiContext } from "../components/Contexts/ApiContext";
import "../styles/globals.css";
import { ClientToken } from "../types/ClientToken";

interface Res extends Response {
  data: ClientToken;
}

function MyApp({ Component, pageProps }: AppProps) {
  const axios = require("axios");
  useEffect(() => {
    const getToken = async () => {
      const res = (await axios.get("api/connect")) as Res;
      setAccessToken(res.data);
      setFinish(true);
      setTimeout(getToken, 3500000);
    };
    getToken();
  }, []);

  const [accessToken, setAccessToken] = useState<ClientToken | null>(null);
  const [finish, setFinish] = useState(false);

  const providerToken = useMemo(
    () => ({ accessToken, setAccessToken, finish }),
    [accessToken, setAccessToken, finish]
  );

  return (
    <ApiContext.Provider value={providerToken}>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </ApiContext.Provider>
  );
}

export default MyApp;
