import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FollowerFollowing } from "../../types/FollowerFollowingType";

interface URLProps extends ParsedUrlQuery {
  username: string;
}

interface Props {
  userFollowers: FollowerFollowing;
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
  console.log(userFollowers)
  return (
    <div className="flex gap-y-3 flex-col place-items-center mt-10">
      <div className="flex w-11/12 sm:w-8/12 md:w-7/12 2xl:w-6/12 justify-between">
        <div>Followers</div>
      </div>
    </div>
  );
};

export default Followers;
