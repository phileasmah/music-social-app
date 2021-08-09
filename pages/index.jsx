import { signIn, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useEffect } from "react";
import NewReleases from "../components/HomePage/NewReleases";
import RecentlyPlayed from "../components/HomePage/RecentlyPlayed";
import RecentlyPlayedLoading from "../components/HomePage/RecentlyPlayedLoading";
import RecentlyReviewed from "../components/HomePage/RecentlyReviewed";

const Home = () => {
  const [session, loading] = useSession();

  useEffect(async () => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log("RefreshAccessTokenError");
      signIn("spotify"); // Force sign in to hopefully resolve error
    }
  }, [session]);

  return (
    <div>
      <Head>
        <title>Music Social App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {loading ? (
        <RecentlyPlayedLoading />
      ) : (
        <div>
          {session && (
            <RecentlyPlayed token={session.user.accessToken} />
          )}
        </div>
      )}
      <RecentlyReviewed />
      <NewReleases />
    </div>
  );
};

export default Home;
