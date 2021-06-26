import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Settings = () => {
  const [session, loading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.push("/sign-in");
    }
  }, [session, loading]);

  return (
    <div className="mx-auto mt-10 flex w-11/12 sm:w-8/12 md:w-7/12 2xl:w-6/12 align-middle">
      <h1 className="text-3xl font-light">Profile Settings</h1>
    </div>
  );
};

export default Settings;
