import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGetApi from "../lib/useGetApi";
import { RecentlyPlayedType, Tracks } from "../types/RecentlyPlayedType";

interface Props {
  token: string;
}

const RecentlyPlayed: React.FC<Props> = ({ token }) => {
  const [recents, setRecents] = useState<Tracks[] | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [privateSession, setPrivateSession] = useState(false);

  useEffect(() => {
    const getRecentlyPlayed = async () => {
      const response = await useGetApi<RecentlyPlayedType>(
        token,
        "me/player/recently-played?&limit=30"
      );
      console.log(response);
      if (response.status === 204) {
        setPrivateSession(true);
        setLoading(false);
        return;
      }
      const res = response.data.items;
      if (!res || res.length === 0) {
        setLoading(false);
        return;
      }
      const data: Tracks[] = [];
      const set = new Set();
      for (let i = 0; i < 30; i++) {
        if (!set.has(res[i].track.album.id)) {
          set.add(res[i].track.album.id);
          data.push(res[i]);
          if (set.size === 5) {
            break;
          }
        }
      }
      setRecents(data);
      console.log(data, res);
      setLoading(false);
    };

    getRecentlyPlayed();
  }, []);

  return (
    <div>
      <div>Recently Played:</div>
      {loading ? (
        <div>Loading...</div>
      ) : privateSession ? <div>Turn off private session to see your recently played albums</div> : (
        recents ?
        recents.map((r) => (
          <div key={r.track.album.id}>
            {r.track.album.images.length ? (
              <Link
                href={{
                  pathname: "album/[slug]",
                  query: {
                    slug: r.track.album.id,
                  },
                }}
              >
                <div className="w-1/6">
                  <Image
                    src={r.track.album.images[1].url}
                    alt={r.track.album.name + " album art"}
                    width={200}
                    height={200}
                  />
                </div>
              </Link>
            ) : (
              <div>No picture found</div>
            )}
            <b>{r.track.album.name}</b> by {r.track.artists[0].name}
          </div>
        )) : <div>No recently played music on this account</div>
      )}
    </div>
  );
};

export default RecentlyPlayed;
