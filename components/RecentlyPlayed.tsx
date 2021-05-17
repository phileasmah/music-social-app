import { useEffect, useState } from "react";
import useGetApi from "../lib/useGetApi";
import { RecentlyPlayedType, Tracks } from "../types/RecentlyPlayedType";
interface Props {
  token: string;
}

const RecentlyPlayed: React.FC<Props> = ({ token }) => {
  const [recents, setRecents] = useState<Tracks[] | null | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecentlyPlayed = async () => {
      const res = (await useGetApi(
        token,
        "me/player/recently-played?&limit=5"
      )) as RecentlyPlayedType;
      setRecents(res.items);
      setLoading(false);
    };

    getRecentlyPlayed();
  }, []);

  return (
    <div>
      <div>Recently Played:</div>
      {loading ? <div>Loading...</div> : <> </>}
      {recents ? recents.map((r) => 
        <div key={r.track.id}> {r.track.name} - {r.track.album.name} by {r.track.artists[0].name}</div>
      ) : <> </> }
    </div>
  );
};

export default RecentlyPlayed;
