import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DefaultImage from "../DefaultImage";

interface Props {
  user: string;
}

interface UserInfo {
  image: string | null;
  name: string;
  accounts: [{ providerAccountId: string }];
  _count: {followers: number, following: number}
}

const User: React.FC<Props> = ({ user }) => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const getUserProfile = async () => {
      const res = await fetch(`/api/user`, {
        method: "POST",
        body: JSON.stringify({
          userId: user,
        }),
      });

      if (res.ok) {
        setUserInfo(await res.json());
      }
      setLoading(false);
    };
    getUserProfile();
  }, []);

  return (
    <li>
      {loading ? (
        <div>
          <div className="border-2 border-lightgrey2 rounded-md p-4 w-full mb-3">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-lightgrey2 h-11 w-11"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-lightgrey2 rounded w-36"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-lightgrey2 rounded"></div>
                  <div className="h-4 bg-lightgrey2 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {userInfo ? (
            <div className="flex border-2 border-lightgrey2 rounded-md p-4 w-full mb-3">
              {userInfo.image ? (
                <Image src={userInfo.image} width={50} height={50} className="rounded-full" />
              ) : (
                <DefaultImage height={50} width={50} className="rounded-full" />
              )}
              <div className="flex flex-col ml-6">
                <Link href={`/${userInfo.accounts[0].providerAccountId}`}>
                  <a className="text-text font-semibold text-lg">{userInfo.name}</a>
                </Link>
                <span className="text-gray-400">{userInfo._count.followers} followers, {userInfo._count.following} following</span>
              </div>
            </div>
          ) : (
            <div>Something went wrong</div>
          )}
        </div>
      )}
    </li>
  );
};

export default User;
