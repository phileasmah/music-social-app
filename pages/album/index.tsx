import { useSession } from "next-auth/client";

const Album = () => {
  const [session, loading] = useSession();

  return (
    <div>
      {console.log(session)}
      <div>album</div>
    </div>
  );
};

export default Album;