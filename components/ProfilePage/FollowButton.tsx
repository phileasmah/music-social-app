import { AxiosResponse } from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  session: Session | null | undefined;
  profileId: string;
}

type UserRelationship = [
  {
    followers: [{ followerId: string; followingId: string }];
    following: [{ followerId: string; followingId: string }];
  }
];

const FollowButton: React.FC<Props> = ({ session, profileId }) => {
  const axios = require("axios");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followedBy, setFollowedBy] = useState<boolean | null>(null);
  const [resLoading, setResLoading] = useState(false);
  const [resSuccess, setResSuccess] = useState<null | boolean>(null);

  useEffect(() => {
    if (!session) return;
    const getUserRelationship = async () => {
      const res = (await axios({
        method: "post",
        url: `api/user/relationship`,
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
        data: {
          username: session.user.sub,
          otherUser: profileId,
        },
      })) as AxiosResponse<UserRelationship>;
      res.data[0].followers.length === 1 ? setFollowing(true) : setFollowing(false);
      res.data[0].following.length === 1 ? setFollowedBy(true) : setFollowedBy(false);
      setLoading(false);
    };
    getUserRelationship();
  }, [session]);

  const handleFollowUnfollow = async () => {
    setResLoading(true);
    const res = await fetch(`/api/user/follow-unfollow`, {
      method: "POST",
      body: JSON.stringify({
        userId: session?.user.sub,
        otherUserId: profileId,
        following: following,
      }),
    });

    if (res.ok) {
      setFollowing(!following);
      setResSuccess(true);
      setResLoading(false);
    } else {
      setResSuccess(false);
      setResLoading(false);
    }
  };

  return (
    <div className="flex flex-row">
      {loading ? (
        <div className="animate-pulse bg-lightgrey2 w-20 h-7 my-0.5 rounded-md"> </div>
      ) : (
        <>
          {following ? (
            <button
              onClick={handleFollowUnfollow}
              className={`flex justify-center ${
                resLoading ? "w-28" : "w-24"
              } py-1 bg-blue-600 text-text font-semibold rounded-md hover:rounded-3xl duration-200 hover:bg-blue-700`}
            >
              Following
              {resLoading && (
                <svg
                  className="ml-2 mt-1.5 animate-spin w-3 h-3 rounded-full bg-transparent border-2 border-transparent border-opacity-50"
                  style={{ borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF" }}
                  viewBox="0 0 20 20"
                ></svg>
              )}
            </button>
          ) : (
            <button
              onClick={handleFollowUnfollow}
              className={`flex justify-center ${
                resLoading ? "w-24" : "w-20"
              } py-1 bg-blue-600 text-text font-semibold rounded-md hover:rounded-3xl duration-200 hover:bg-blue-700`}
            >
              Follow
              {resLoading && (
                <svg
                  className="ml-2 mt-1.5 animate-spin w-3 h-3 rounded-full bg-transparent border-2 border-transparent border-opacity-50"
                  style={{ borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF" }}
                  viewBox="0 0 20 20"
                ></svg>
              )}
            </button>
          )}
          {followedBy && (
            <div className="ml-3 text-base align-bottom mt-1 font-light tracking-wide">
              Follows you
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FollowButton;
