import { useSession } from "next-auth/client";

const Profile = () => {
  const [session, loading] = useSession();

  return (
    <div>
      {console.log(session)}
      <div>Loading...</div>
    </div>
  );
};

export default Profile;
