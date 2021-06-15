import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { ArrowRightIcon } from "@heroicons/react/solid";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { UserProfileArr } from "../types/UserProfileInfo";

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
    const res = await fetch("/api/user/update-username", {
      method: "POST",
      body: JSON.stringify({
        id: session?.user.sub,
        newUsername: newUsernameInput
      })
    })
    if (res.ok) {
      setResSuccess(true);
    }
    else {
      setResSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div className="flex gap-y-3 flex-col place-items-center mt-10">
      Your display name:
      <div className="relative">
        {edit ? (
          <>
            {loading && (
              <svg
                className="absolute top-3 -left-9 w-4 h-4 animate-spin rounded-full bg-transparent border-2 border-transparent border-opacity-50"
                style={{ borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF" }}
                viewBox="0 0 20 20"
              ></svg>
            )}
            {resSuccess === true && !loading && (
              <CheckCircleIcon className="absolute top-2 -left-9 w-6 h-6 text-green-500" />
            )}
            {resSuccess === false && !loading && (
              <ExclamationCircleIcon className="lute top-2 -left-9 w-6 h-6 text-red-500" />
            )}
            <input
              defaultValue={newUsernameInput}
              readOnly={loading}
              placeholder={userProfileInfo[0].name}
              className="bg-lightgrey text-text p-2 rounded-lg"
              onChange={(e) => setNewUserInput(e.target.value)}
            ></input>
            {newUsernameInput && !loading && (
              <button
                onClick={handleNewUsername}
                className="top-1 absolute ml-2 py-1 px-2 border-2 rounded-full hover:bg-lightgrey focus:bg-lightgrey"
              >
                <ArrowRightIcon className="w-5 h-5" />
              </button>
            )}
          </>
        ) : (
          userProfileInfo[0].name
        )}
      </div>
      {isOwner && (
        <button onClick={() => setEdit(!edit)} className="py-1 px-2 border-2 rounded-lg">
          Edit
        </button>
      )}
    </div>
  );
};

export default UserProfile;
