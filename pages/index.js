import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
const axios = require("axios");
const querystring = require("querystring");

const Home = () => {
  const [session, loading] = useSession();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log("RefreshAccessTokenError");
      signIn("spotify"); // Force sign in to hopefully resolve error
    }
    if (session) {
      callApi("GET", "me/player/devices", null, "callback");
    }
  }, [session]);

  const callApi = (method, url, body, callback) => {
    axios
      .get("https://api.spotify.com/v1/" + url, {
        headers: { Authorization: "Bearer " + session.user.accessToken },
      })
      .then((response) => {
        // If request is good...
        console.log(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  console.log(session);
  return (
    <div>
      <Head>
        <title>Music Social App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session ? (
        <div>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <div className={styles.container}>
          <button onClick={() => signIn("spotify")}>Login with Spotify</button>
        </div>
      )}
    </div>
  );
};

export default Home;
