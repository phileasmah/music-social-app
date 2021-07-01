import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { FollowerFollowing } from "../../types/FollowerFollowingType";

interface URLProps extends ParsedUrlQuery {
  username: string;
}

interface Props {
  userFollowing: FollowerFollowing;
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
      <div className="flex w-11/12 sm:w-8/12 md:w-7/12 2xl:w-6/12 justify-between">
        <div>Following</div>
      </div>
    </div>
  );
};

export default Following;
