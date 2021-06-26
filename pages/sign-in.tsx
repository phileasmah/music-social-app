import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SignIn = () => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      console.log("yes");
      router.push("/");
    }
  }, [session, loading]);

  return (
    <div className="flex align-middle">
      <button
        onClick={() => signIn("spotify")}
        className="px-2.5 md:px-4 py-2 font-semibold bg-blue-600 rounded text-white duration-200 hover:bg-blue-500 focus:bg-blue-500 hover:rounded-2xl focus:rounded-2xl"
      >
        Login with Spotify
      </button>
    </div>
  );
};

export default SignIn;
