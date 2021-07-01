import { AxiosResponse } from "axios";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  session: Session | null | undefined;
}

type UserRelationship = [
  {
    followedBy: [{ name: string }];
    following: [{ name: string }];
  }
];

const FollowButton: React.FC<Props> = ({ session }) => {
  const axios = require("axios");
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [followedBy, setFollowedBy] = useState<boolean | null>(null)
  const [relationship, setRelationship] = useState<null | UserRelationship>(null);

  useEffect(() => {
    if (!session) return;

    const getUserRelationship = async () => {
      const res = (await axios({
        url: `api/user/${session.user.id}/${router.query.username}`,
        baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      })) as AxiosResponse<UserRelationship>;
      res.data[0].following.length === 1 ? setFollowing(true) : setFollowing(false) 
      res.data[0].followedBy.length === 1 ? setFollowedBy(true) : setFollowedBy(false)
      setLoading(false);
    };

    getUserRelationship();
  }, [session]);

  return (
    <div className="flex flex-row">
      {loading ? (
        <div className="animate-pulse bg-lightgrey2 w-20 h-7 my-0.5 rounded-md"> </div>
      ) : (
        <>
          {following ? (
            <button className="px-3 py-1 bg-blue-600 text-text font-medium rounded-md">
              Following
            </button>
          ) : (
            <button className="px-3 py-1 bg-blue-600 text-text font-medium rounded-md">
              Follow
            </button>
          )}
          {
            followedBy && <div className="ml-2">follows you</div>
          }
        </>
      )}
    </div>
  );
};

export default FollowButton;
