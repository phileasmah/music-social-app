import { Provider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect, useMemo, useState } from "react";
import { ApiContext } from "../components/Contexts/ApiContext";
import NavBar from "../components/NavBar";
import "../styles/globals.css";
import { ClientToken } from "../types/ClientToken";

interface Res extends Response {
  data: ClientToken;
}

NProgress.configure({
  minimum: 0.2,
  easing: "ease",
  speed: 400,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }: AppProps) {
  const axios = require("axios");

  useEffect(() => {
    const getToken = async () => {
      const res = (await axios({
        url: "api/connect",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      })) as Res;
      setClientToken(res.data);
      setFinish(true);
      setTimeout(getToken, 3500000);
    };
    getToken();
  }, []);

  const [clientToken, setClientToken] = useState<ClientToken | null>(null);
  const [finish, setFinish] = useState(false);

  const providerToken = useMemo(
    () => ({ clientToken, setClientToken, finish }),
    [clientToken, setClientToken, finish]
  );

  return (
    <ApiContext.Provider value={providerToken}>
      <Provider session={pageProps.session}>
        <NavBar />
        <Component {...pageProps} />
      </Provider>
    </ApiContext.Provider>
  );
}

export default MyApp;
