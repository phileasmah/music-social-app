import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useGetApi from "../../lib/useGetApi";
import { RecentlyPlayedType, Tracks } from "../../types/RecentlyPlayedType";
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
    <div className="max-w-9/10 2xl:max-w-max mx-auto mt-3">
      <h1 className="text-text font-medium text-xl mb-2">Recently Played:</h1>
      {loading ? (
        <RecentlyPlayedLoading />
      ) : privateSession ? (
        <div>Turn off private session to see your recently played albums</div>
      ) : recents ? (
        <div className="flex gap-x-6 flex-row flex-nowrap overflow-auto justify-between ">
          {recents.map((r) => (
            <Link
              href={{
                pathname: "album/[slug]",
                query: {
                  slug: r.track.album.id,
                },
              }}
              key={r.track.album.id}
            >
              <a className="w-max md:w-52 2xl:w-60 3xl:w-66 group flex flex-col flex-shrink-0 rounded-lg focus:bg-lightgrey hover:bg-lightgrey duration-300 border-2 border-darkgrey hover:border-lightgrey2 focus:border-lightgrey2">
                <div className="transform duration-200 hover:scale-90 group-focus:scale-90">
                  {r.track.album.images.length ? (
                    <Image
                      src={r.track.album.images[1].url}
                      alt={r.track.album.name + " album art"}
                      width={260}
                      height={260}
                      className="rounded-md"
                    />
                  ) : (
                    <div>No picture found</div>
                  )}
                  <div className="w-64 md:w-48 2xl:w-56 3xl:w-64">
                    <b>{r.track.album.name}</b>
                    <div>
                      by {r.track.album.artists[0].name}
                      {r.track.album.artists.length > 1 &&
                        r.track.album.artists
                          .slice(1)
                          .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                    </div>
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
