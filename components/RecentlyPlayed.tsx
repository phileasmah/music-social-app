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
    <div className="max-w-9/10 md:max-w-3/4 mx-auto mt-3">
      <h1 className="text-text font-medium text-xl mb-2">Recently Played:</h1>
      {loading ? (
        <RecentlyPlayedLoading />
      ) : privateSession ? (
        <div>Turn off private session to see your recently played albums</div>
      ) : recents ? (
        <div className="flex gap-x-10 flex-row flex-nowrap overflow-auto justify-between ">
          {recents.map((r) => (
            <Link
              href={{
                pathname: "album/[slug]",
                query: {
                  slug: r.track.album.id,
                },
              }}
            >
              <a
                key={r.track.album.id}
                className="group flex flex-col flex-shrink-0 rounded-lg focus:bg-lightgrey hover:bg-lightgrey duration-300 border-2 border-darkgrey hover:border-lightgrey2 focus:border-lightgrey2"
              >
                <div className="transform duration-200 hover:scale-90 group-focus:scale-90">
                  {r.track.album.images.length ? (
                    <div className="">
                      <Image
                        src={r.track.album.images[1].url}
                        alt={r.track.album.name + " album art"}
                        width={270}
                        height={270}
                        className="rounded-md"
                      />
                    </div>
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
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div>No recently played music on this account</div>
      )}
    </div>
  );
};

export default RecentlyPlayed;
