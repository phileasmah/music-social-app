import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGetApi from "../lib/useGetApi";
import { RecentlyPlayedType, Tracks } from "../types/RecentlyPlayedType";
import RecentlyPlayedLoading from "./RecentlyPlayedLoading";

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
      setLoading(false);
    };

    getRecentlyPlayed();
  }, []);

  return (
    <div className="w-max max-w-9/10 mx-auto mt-3">
      <h1 className="text-text font-medium text-xl mb-2">Recently Played:</h1>
      {loading ? (
        <RecentlyPlayedLoading />
      ) : privateSession ? (
        <div>Turn off private session to see your recently played albums</div>
      ) : recents ? (
        <div className="flex flex-row flex-nowrap overflow-auto"> 
          {recents.map((r) => (
            <div key={r.track.album.id} className="w-80 flex-shrink-0">
              {r.track.album.images.length ? (
                <Link
                  href={{
                    pathname: "album/[slug]",
                    query: {
                      slug: r.track.album.id,
                    },
                  }}
                >
                  <div className="">
                    <Image
                      src={r.track.album.images[1].url}
                      alt={r.track.album.name + " album art"}
                      width={270}
                      height={270}
                      className="rounded-md"
                    />
                  </div>
                </Link>
              ) : (
                <div>No picture found</div>
              )}
              <b>{r.track.album.name}</b>
              <div>
                by {r.track.artists[0].name}
                {r.track.artists.length > 1 &&
                  r.track.artists
                    .slice(1)
                    .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
              </div>
            </div>
          ))}{" "}
        </div>
      ) : (
        <div>No recently played music on this account</div>
      )}
    </div>
  );
};

export default RecentlyPlayed;
