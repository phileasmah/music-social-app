import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useContext, useEffect } from "react";
import { ApiContext } from "../components/Contexts/ApiContext";
import Loading from "../components/Loading.tsx";
import RecentlyPlayed from "../components/RecentlyPlayed.tsx";
import SearchBar from "../components/SearchBar.tsx";

const Home = () => {
  const [session, loading] = useSession();
  const { clientToken, finish } = useContext(ApiContext);

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
          {finish && <SearchBar />}
          {session ? (
          <div>
            <RecentlyPlayed token={session.user.accessToken} />
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-s font-semibold border-2 rounded text-gray-600 hover:border-lightblue hover:text-lightblue duration-200" 
            >
              Sign Out
            </button>
          </div>
          ) : (
          <div>
            <button
              onClick={() => signIn("spotify")}
              className="px-4 py-2 text-s font-semibold border-2 rounded text-gray-600 hover:border-lightblue hover:text-lightblue duration-200"
            >
              Login with Spotify
            </button>
          </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
