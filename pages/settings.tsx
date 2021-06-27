import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import ChangeDisplayNameInput from "../components/Settings/ChangeDisplayNameInput";
import ChangeUsernameInput from "../components/Settings/ChangeUsernameInput";

const Settings = () => {
  const [session, loading] = useSession();
  const displayName = useRef();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/sign-in");
    }
  }, [session, loading]);

  return (
    <div className="mx-auto mt-10 flex flex-col w-11/12 sm:w-8/12 md:w-7/12 2xl:w-6/12 align-middle">
      <h1 className="text-3xl font-medium text-text pl-8">Account Info</h1>
      {session && (
        <div className="border-2 px-8 pt-6 border-lightgrey2 rounded-lg flex flex-col mt-6">
          <h2 className="text-2xl mb-3 text-text">Profile Settings</h2>
          <ChangeUsernameInput session={session} />
          <ChangeDisplayNameInput session={session} />
        </div>
      )}
    </div>
  );
};

export default Settings;
