import { signIn, signOut, useSession } from "next-auth/client";
import Head from "next/head";
import React, { useEffect } from "react";
import Loading from "../components/Loading.tsx";
import SearchBar from "../components/SearchBar.tsx";

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
      ) : session ? (
        <div>
          <SearchBar token={session.user.accessToken} />
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-s font-semibold border-2 border-gray-300 rounded hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="static">
          <button
            onClick={() => signIn("spotify")}
            className="px-4 py-2 text-s font-semibold border-2 border-gray-300 rounded hover:bg-gray-200 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Login with Spotify
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
