import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Loading from "../components/Loading.tsx";
import styles from "../styles/Home.module.css";
const axios = require("axios");


const Home = () => {
  const [session, loading] = useSession();
  const [ devices, setDevices] = useState([]);

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
        setDevices(response.data.devices);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  // const addCount = async() => {
  //   const response = await fetch("/api/users", {
  //     method: "POST",
  //     body: JSON.stringify(session.user)
  //   })

  //   return await response.json();
  // }
  return (
    <div>
      <Head>
        <title>Music Social App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <Loading />
      ) : session ? (
        <div>
          {devices.map(device => (
            <div key={device.id}>{device.name} - {device.type}</div>
          ))}
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
