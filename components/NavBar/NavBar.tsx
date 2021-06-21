import { signIn, signOut, useSession } from "next-auth/client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "./Searchbar/SearchBar";

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
    <nav className={`sticky top-0 bg-darkgrey z-10 ${!scroll && "border-lightgrey2 border-b-2"}`}>
      <div className={`flex h-16 items-center ${scroll && "shadow-custom"} px-6 lg:px-10`}>
        <Link href={{ pathname: "/" }}>
          <a className="px-2 pt-1.5 pb-2 duration-200 text-text font-medium text-xl focus:underline rounded-xl" tabIndex={1}>Home</a>
        </Link>
        <div className="flex ml-auto">
          {session && (
            <>
              <Link href={{ pathname: `/${session.user.id}` }}>
                <a className="flex items-center mx-3 md:mx-6 duration-200 rounded-full p-1 focus:bg-lightgrey3 text-text" tabIndex={3}>
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
              className="hover:bg-lightgrey px-4 py-2 text-text font-normal md:font-semibold border border-lightgrey2 rounded duration-200 focus:bg-lightgrey3"
              tabIndex={4}
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => signIn("spotify")}
              className="px-4 py-2 font-normal md:font-semibold bg-blue-600 rounded text-white duration-200 hover:bg-blue-500 focus:bg-blue-500 hover:rounded-2xl focus:rounded-2xl"
            >
              Login with Spotify
            </button>
          )}
        </div>
        <SearchBar />
      </div>
    </nav>
  );
};

export default NavBar;
