import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/client";
import { ParsedUrlQuery } from "querystring";
import UserProfile from "../../components/UserProfile";
import { UserProfileArr } from "../../types/UserProfileInfo";

interface URLProps extends ParsedUrlQuery {
  username: string;
}

interface Props {
  userProfileInfo: UserProfileArr | null;
}

export const getServerSideProps: GetServerSideProps<{}, URLProps> = async (context) => {
  const axios = require("axios");
  const res = (await axios({
    url: `api/user/${context.params?.username}`,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  })) as AxiosResponse;
  let userProfileInfo;
  if (res.status == 200) {
    userProfileInfo = res.data;
  } else {
    userProfileInfo = null;
  }
  return {
    props: { userProfileInfo },
  };
};

const Profile: React.FC<Props> = ({ userProfileInfo }) => {
  const [session, loading] = useSession();
  
  return (
    <>
      {loading ? (
        <div>Profile loading animation</div>
      ) : userProfileInfo ? (
        <UserProfile session={session} userProfileInfo={userProfileInfo}/>
      ) : (
        <div>404 no profile</div>
      )}
    </>
  );
};

export default Profile;
