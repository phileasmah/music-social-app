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
  const res = await axios({
    url: `api/review/recents`,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  });
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
        <div>
          {session ? (
            <RecentlyPlayed token={session.user.accessToken} />
          ) : (
            <div className="max-w-9/10 md:w-84% 3xl:w-74% 4xl:w-84%  mx-auto mt-3 mb-8">
              <h1 className="text-text font-medium text-xl mb-1.5 w-">Recently Played</h1>
              <hr className="border-gray-400 mb-3" />
              <div>
                <button
                  onClick={() => signIn("spotify")}
                  className="font-medium text-text duration-200 bg-blue-600 px-2.5 py-1 rounded hover:bg-blue-500 focus:bg-blue-500"
                >
                  Login
                </button>
                <span className="ml-1.5 text-text">to see your recently played albums</span>
              </div>
            </div>
          )}
        </div>
      )}
      <RecentlyReviewed recents={recents} />
      <NewReleases />
    </div>
  );
};

export default Home;
