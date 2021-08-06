import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import User from "../../components/ProfilePage/User";
import { FollowingType } from "../../types/FollowingType";

interface URLProps extends ParsedUrlQuery {
  username: string;
}

interface Props {
  userFollowing: FollowingType;
}

export const getServerSideProps: GetServerSideProps<{}, URLProps> = async (context) => {
  const axios = require("axios");
  const res = (await axios({
    url: `api/user/${context.params?.username}/following`,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  })) as AxiosResponse;
  let userFollowing;
  if (res.status == 200) {
    userFollowing = res.data;
  } else {
    userFollowing = null;
  }
  return {
    props: { userFollowing },
  };
};

const Following: React.FC<Props> = ({ userFollowing }) => {
  return (
    <div className="flex gap-y-3 flex-col place-items-center mt-10">
      <div className="flex flex-col w-11/12 sm:w-8/12 md:w-7/12 2xl:w-6/12 justify-between">
        <h1 className="text-2xl text-text font-medium mb-8">Followers</h1>
        {userFollowing[0].following.length > 0 ? (
          <ul className="flex flex-col hay-y-3">
            {userFollowing[0].following.map((user) => (
              <User key={user.followerId} user={user.followerId} />
            ))}
          </ul>
        ) : (
          <div>You are not following anyone</div>
        )}
      </div>
    </div>
  );
};

export default Following;
