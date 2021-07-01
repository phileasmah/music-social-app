import Link from "next/link";
import { useRouter } from "next/router";



const UserStatistics = () => {

  const router = useRouter();

  return (
    <div className="flex gap-x-3">
      <Link href={`${router.asPath}/following`}>
        <a>Following</a>
      </Link>
      <Link href={`${router.asPath}/followers`}>
        <a>Followers</a>
      </Link>
    </div>
  );
};

export default UserStatistics;
