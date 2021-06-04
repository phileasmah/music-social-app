import { signIn, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useEffect } from "react";
import Loading from "../components/Loading.tsx";
import RecentlyPlayed from "../components/RecentlyPlayed.tsx";

const Home = () => {
  const [session, loading] = useSession();

  useEffect(async () => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log("RefreshAccessTokenError");
      signIn("spotify"); // Force sign in to hopefully resolve error
    }
  }, [session]);

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
      ) : (
        <div>
          {session ? (
          <div>
            <RecentlyPlayed token={session.user.accessToken} />
          </div>
          ) : (
          <div>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
