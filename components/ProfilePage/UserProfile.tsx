import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserProfileArr } from "../../types/UserProfileInfo";
import DefaultImage from "../DefaultImage";
import ReviewedAlbums from "./ReviewedAlbums";
import UserStatistics from "./UserStatistics";

interface Props {
  session: Session | null | undefined;
  userProfileInfo: UserProfileArr;
}

const UserProfile: React.FC<Props> = ({ session, userProfileInfo }) => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (session?.user.sub === userProfileInfo[0].id) {
      setIsOwner(true);
    }
  }, [session]);
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
              <div className="flex-col flex my-auto">
                <span className="font-medium text-xl text-text mb-1">
                  {userProfileInfo[0].name}
                </span>
              </div>
            </div>
            {session && (
              <>
                {isOwner ? (
                  <Link href="/settings">
                    <a className="px-3 pb-1 border-2 rounded-lg">Edit</a>
                  </Link>
                ) : (
                  <button className="px-3 pb-1 border-2 rounded-lg">Follow</button>
                )}
              </>
            )}
          </div>
        </div>
        <UserStatistics />
      </div>
      <ReviewedAlbums reviews={userProfileInfo[0].reviews} />
    </div>
  );
};

export default UserProfile;
