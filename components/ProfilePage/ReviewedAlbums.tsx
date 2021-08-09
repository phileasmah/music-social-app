import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import useGetApi from "../../lib/useGetApi";
import { AlbumInfo } from "../../types/AlbumInfo";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { Review } from "../../types/UserProfileInfo";
import { ApiContext } from "../Contexts/ApiContext";

interface Props {
  reviews: Review[];
}

interface AxiosResponse {
  albums: AlbumInfo[];
}

const ReviewedAlbums: React.FC<Props> = ({ reviews }) => {
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const [albumInfo, setAlbumInfo] = useState<AlbumInfo[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientToken || reviews.length === 0) {
      setLoading(false);
      return;
    }

    if (reviews.length == 0) {
      return;
    }

    let albumIdsUrl = `albums?ids=${reviews[0].albumId}`;
    if (reviews.length > 1) {
      for (let i = 1; i < reviews.length; i++) {
        albumIdsUrl += `%2C${reviews[i].albumId}`;
      }
    }

    const getRecentReviewedAlbumInfo = async (url: string) => {
      const res = await useGetApi<AxiosResponse>(clientToken?.access_token, url);
      setAlbumInfo(res.data.albums);
      setLoading(false);
    };

    getRecentReviewedAlbumInfo(albumIdsUrl);
  }, [clientToken]);

  return (
    <div className="max-w-9/10 md:max-w-6/7 2xl:max-w-max mx-auto mt-3">
      <h1 className="text-text font-medium text-xl mb-1.5">Recently Reviewed</h1>
      <hr className="border-gray-400 mb-3" />
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="flex gap-x-6 flex-row flex-nowrap overflow-auto justify-between">
          {albumInfo ? (
            <div className="flex gap-x-6 flex-row flex-nowrap overflow-auto justify-between ">
              {albumInfo.map((r, idx) => (
                <Link
                  href={{
                    pathname: "album/[slug]",
                    query: {
                      slug: r.id,
                    },
                  }}
                  key={r.id}
                >
                  <a className="w-max md:w-56 2xl:w-60 3xl:w-66 group flex flex-col flex-shrink-0 rounded-lg focus:bg-lightgrey hover:bg-lightgrey duration-300 border-2 border-darkgrey hover:border-lightgrey2 focus:border-lightgrey2">
                    <div className="transform duration-200 hover:scale-90 group-focus:scale-90">
                      {r.images.length ? (
                        <Image
                          src={r.images[1].url}
                          alt={r.name + " album art"}
                          width={260}
                          height={260}
                          className="rounded-md"
                        />
                      ) : (
                        <div>No picture found</div>
                      )}
                      <div className="w-64 md:w-52 2xl:w-56 3xl:w-64">
                        <b>{r.name}</b>
                        <div className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                          by {r.artists[0].name}
                          {r.artists.length > 1 &&
                            r.artists
                              .slice(1)
                              .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                        </div>
                        {reviews[idx].rating != 0 ? (
                          <ReactStars
                            value={reviews[idx].rating}
                            edit={false}
                            isHalf={true}
                            size={18}
                          />
                        ) : (
                          <span className="text-sm italic">Only written review</span>
                        )}
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div>User hasn't reviewed an album yet</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewedAlbums;
