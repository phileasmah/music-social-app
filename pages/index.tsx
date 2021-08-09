import { GetServerSideProps } from "next";
import { signIn, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useEffect } from "react";
import NewReleases from "../components/HomePage/NewReleases";
import RecentlyPlayed from "../components/HomePage/RecentlyPlayed";
import RecentlyPlayedLoading from "../components/HomePage/RecentlyPlayedLoading";
import RecentlyReviewed from "../components/HomePage/RecentlyReviewed";
import { RecentlyReviewedType } from "../types/RecentlyReviewed";

interface Props {
  recents: RecentlyReviewedType | null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const axios = require("axios");
  const res = (await axios({
    url: `api/review/recents`,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  }))
  let recents = null;
  if (res.status == 200) {
    recents = res.data;
  }
  return {
    props: { recents },
  };
};

const Home: React.FC<Props> = ({ recents }) => {
  const [session, loading] = useSession();

  useEffect(() => {
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
        <div>{session && <RecentlyPlayed token={session.user.accessToken} />}</div>
      )}
      <RecentlyReviewed recents={recents}/>
      <NewReleases />
    </div>
  );
};

export default Home;
