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

  useEffect(() => {
    const getRecentlyPlayed = async () => {
      const res = (await useGetApi(
        token,
        "me/player/recently-played?&limit=5"
      )) as RecentlyPlayedType;
      console.log(res.items);
      setRecents(res.items);
      setLoading(false);
    };

    getRecentlyPlayed();
  }, []);

  return (
    <div>
      <div>Recently Played:</div>
      {loading ? <div>Loading...</div> : <> </>}
      {recents ? (
        recents.map((r) => (
          <div key={r.track.id}>
            {r.track.album.images.length ? (
              <Link
                href={{
                  pathname: "album/[slug]",
                  query: {
                    slug: r.track.album.name + "-" + r.track.album.artists[0].name,
                    albumName: r.track.album.name,
                    artist: r.track.album.artists[0].name,
                    albumId: r.track.album.id,
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
            {r.track.name} - {r.track.album.name} by {r.track.artists[0].name}
          </div>
        ))
      ) : (
        <> </>
      )}
    </div>
  );
};

export default RecentlyPlayed;
