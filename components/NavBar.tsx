import { signIn, signOut, useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

const NavBar = () => {
  const [scroll, setScroll] = useState(false);
  const [session, loading] = useSession();

  useEffect(() => {
    const handleScroll = () => {
      if (document.scrollingElement === null) return;
      if (document.scrollingElement.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    document.addEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-0 bg-darkgrey z-10">
      <div className={`flex h-16 items-center ${scroll && "shadow-custom"} px-10`}>
        <Link href={{ pathname: "/" }}>
          <a className="p-2 duration-200 text-text font-medium text-xl">Home</a>
        </Link>
        <div className="flex ml-auto">
          {session && (
            <>
              <Link href={{ pathname: "/" }}>
                <a className="flex items-center mx-6 duration-200 text-text">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt="User's Profile Pic"
                      width={37}
                      height={37}
                      className="rounded-full"
                    />
                  ) : (
                    <Image
                      src="/default_profile_pic.png"
                      alt="User's Profile Pic"
                      width={37}
                      height={37}
                      className="rounded-full"
                    />
                  )}
                </a>
              </Link>
            </>
          )}
          {session || loading ? (
            <button
              onClick={() => signOut()}
              className="hover:bg-lightgrey px-4 py-2 text-text font-semibold border border-lightgrey2 rounded duration-200"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn("spotify")}
              className="px-4 py-2 text-s font-semibold border-2 rounded hover:border-lightblue hover:text-lightblue duration-200"
            >
              Login with Spotify
            </button>
          )}
        </div>
        <SearchBar />
      </div>
      {!scroll && <hr className="border-lightgrey2 border-t-2" />}
    </nav>
  );
};

export default NavBar;
