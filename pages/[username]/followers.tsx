import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import User from "../../components/ProfilePage/User";
import { FollowersType } from "../../types/FollowersType";

interface URLProps extends ParsedUrlQuery {
  username: string;
}

interface Props {
  userFollowers: FollowersType;
}

export const getServerSideProps: GetServerSideProps<{}, URLProps> = async (context) => {
  const axios = require("axios");
  const res = (await axios({
    url: `api/user/${context.params?.username}/followers`,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  })) as AxiosResponse;
  let userFollowers;
  if (res.status == 200) {
    userFollowers = res.data;
  } else {
    userFollowers = null;
  }
  return {
    props: { userFollowers },
  };
};

const Followers: React.FC<Props> = ({ userFollowers }) => {
  return (
    <div className="flex gap-y-3 flex-col place-items-center mt-10">
      <div className="flex flex-col w-11/12 sm:w-8/12 md:w-7/12 2xl:w-6/12 justify-between">
        <h1 className="text-2xl text-text font-medium mb-8">Followers</h1>
        {userFollowers[0].followers.length > 0 ? (
          <ul className="flex flex-col hay-y-3">
            {userFollowers[0].followers.map((user) => (
              <User key={user.followingId} user={user.followingId} />
            ))}
          </ul>
        ) : (
          <div>You do not have any followers yet</div>
        )}
      </div>
    </div>
  );
};

export default Followers;
