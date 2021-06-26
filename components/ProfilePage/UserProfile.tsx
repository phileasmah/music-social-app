import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { Session } from "next-auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UserProfileArr } from "../../types/UserProfileInfo";
import DefaultImage from "../DefaultImage";
import ReviewedAlbums from "./ReviewedAlbums";

interface Props {
  session: Session | null | undefined;
  userProfileInfo: UserProfileArr;
}

const UserProfile: React.FC<Props> = ({ session, userProfileInfo }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [edit, setEdit] = useState(false);
  const [newUsernameInput, setNewUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [resSuccess, setResSuccess] = useState<null | boolean>(null);

  useEffect(() => {
    if (session?.user.sub === userProfileInfo[0].id) {
      setIsOwner(true);
    }
  }, [session]);

  const handleNewUsername = async () => {
    setLoading(true);
    const cleanUsernameInput = newUsernameInput.trim();
    if (cleanUsernameInput === userProfileInfo[0].name) {
      setResSuccess(true);
      setLoading(false);
    }
    const res = await fetch("/api/user/update-username", {
      method: "POST",
      body: JSON.stringify({
        id: session?.user.sub,
        newUsername: newUsernameInput,
      }),
    });
    if (res.ok) {
      setResSuccess(true);
    } else {
      setResSuccess(false);
    }
    setLoading(false);
  };
  console.log(userProfileInfo);

  return (
    <div className="flex gap-y-3 flex-col place-items-center mt-10">
      <div className="flex w-11/12 sm:w-8/12 md:w-7/12 2xl:w-6/12 justify-between">
        <div className="flex">
          {userProfileInfo[0].image ? (
            <Image
              src={userProfileInfo[0].image}
              alt={userProfileInfo[0].name + " image"}
              width={88}
              height={88}
              className="rounded-full"
            />
          ) : (
            <DefaultImage height={88} width={88} className="rounded-full" />
          )}
          <div className="ml-4 my-auto">
            <div className="mb-1">
              {edit ? (
                <div className="relative">
                  {loading && (
                    <svg
                      className="z-20 absolute top-3 -left-9 w-4 h-4 animate-spin rounded-full bg-transparent border-2 border-transparent border-opacity-50"
                      style={{ borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF" }}
                      viewBox="0 0 20 20"
                    ></svg>
                  )}
                  {resSuccess === true && !loading && (
                    <CheckCircleIcon className="z-20 absolute top-2 -left-9 w-6 h-6 text-green-500" />
                  )}
                  {resSuccess === false && !loading && (
                    <ExclamationCircleIcon className="z-20 absolute top-2 -left-9 w-6 h-6 text-red-500" />
                  )}
                  <input
                    defaultValue={userProfileInfo[0].name}
                    readOnly={loading}
                    placeholder={userProfileInfo[0].name}
                    className="bg-lightgrey text-text p-1 rounded-lg"
                    onChange={(e) => setNewUserInput(e.target.value)}
                  ></input>
                  {newUsernameInput && newUsernameInput !== userProfileInfo[0].name && !loading && (
                    <button
                      onClick={handleNewUsername}
                      className="z-20 top-1 absolute ml-2 py-1 px-2 border-2 rounded-full hover:bg-lightgrey focus:bg-lightgrey"
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex-col flex my-auto">
                  <span className="font-medium text-xl text-text mb-1">
                    {userProfileInfo[0].name}
                  </span>
                </div>
              )}
            </div>
            {isOwner && (
              <button onClick={() => setEdit(!edit)} className="px-3 border-2 rounded-lg">
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      <ReviewedAlbums reviews={userProfileInfo[0].reviews} />
    </div>
  );
};

export default UserProfile;
