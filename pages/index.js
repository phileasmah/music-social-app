import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useEffect } from "react";
import styles from "../styles/Home.module.css";
const axios = require("axios");

const Home = () => {
  const [session, loading] = useSession();

  useEffect(() => {
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
        if (error.response.status == 401) {
          refreshAccessToken();
        } else {
          console.log(error.response);
        }
      });
  };

  const refreshAccessToken = () => {
    axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: "Bearer " + session.user.accessToken 
      },
      data: {
        grant_type: "refresh_token",
        refresh_token: session.user.refreshToken,
        client_id: "7d5aa24c7fd749a2ac663d404642fdf1"
      },
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
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
          ``
          <button onClick={() => signIn("spotify")}>Login with Spotify</button>
        </div>
      )}
    </div>
  );
};

export default Home;
