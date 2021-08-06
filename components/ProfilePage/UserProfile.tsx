import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserProfileArr } from "../../types/UserProfileInfo";
import DefaultImage from "../DefaultImage";
import FollowButton from "./FollowButton";
import ReviewedAlbums from "./ReviewedAlbums";
import UserStatistics from "./UserStatistics";

interface Props {
  session: Session | null | undefined;
  userProfileInfo: UserProfileArr;
}


const UserProfile: React.FC<Props> = ({ session, userProfileInfo }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user.sub === userProfileInfo[0].id) {
      setIsOwner(true);
    }
    setLoading(false)
  }, [session]);


  return (
    <div className="flex gap-y-3 flex-col place-items-center mt-8 sm:mt-9">
      <div className="flex flex-col mb-0 sm:mb-2 sm:flex-row sm:w-10/12 md:w-9/12 xl:w-7/12 2xl:w-6/12 justify-between">
        <div className="flex flex-none mb-6 sm:mb-0">
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
                <span className="tracking-normal text-2xl font-medium text-text mb-1">
                  {userProfileInfo[0].name}
                </span>
              </div>
            </div>
            {session && !loading && (
              <>
                {isOwner ? (
                  <Link href="/settings">
                    <a className="px-3 pb-1 border-2 rounded-lg">Edit</a>
                  </Link>
                ) : (
                  <FollowButton session={session} profileId={userProfileInfo[0].id}/>             
                )}
              </>
            )}
          </div>
        </div>
        <UserStatistics statistics={userProfileInfo[0]["_count"]}/>
      </div>
      <ReviewedAlbums reviews={userProfileInfo[0].reviews} />
    </div>
  );
};

export default UserProfile;
