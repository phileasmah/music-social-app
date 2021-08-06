import { UserProfile } from "../../types/UserProfileInfo";
import Statistic from "./Statistic";

interface Props {
  statistics: UserProfile["_count"]
}

const UserStatistics: React.FC<Props>  = ({statistics}) => {

  
  return (
    <div className="flex gap-x-9 my-auto">
      <Statistic name={"Followers"} statistic={statistics.followers} link={"followers"}/>
      <Statistic name={"Following"} statistic={statistics.following} link={"following"}/>
      <Statistic name={"Reviews"} statistic={statistics.reviews}/>
    </div>
  );
};

export default UserStatistics;
