import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import useGetApi from "../../lib/useGetApi";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { NewReleasesType } from "../../types/NewReleasesType";
import { ApiContext } from "../Contexts/ApiContext";
import RecentlyPlayedLoading from "./RecentlyPlayedLoading";

const NewReleases: React.FC = () => {
  const [newReleases, setNewReleases] = useState<null | NewReleasesType>(null);
  const [loading, setLoading] = useState(true);
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;

  useEffect(() => {
    if (!clientToken) return;

    const getNewReleases = async () => {
      const response = await useGetApi<NewReleasesType>(
        clientToken?.access_token,
        "browse/new-releases?limit=5"
      );
      setNewReleases(response.data);
      setLoading(false);
    };

    getNewReleases();
  }, [clientToken]);

  return (
    <div className="max-w-9/10 md:w-84% 3xl:w-74% 4xl:w-84% mx-auto mt-3 mb-8">
      <h1 className="text-text font-medium text-xl mb-1.5">New releases</h1>
      <hr className="border-gray-400 mb-3" />
      {loading ? (
        <RecentlyPlayedLoading />
      ) : newReleases ? (
        <div className="flex gap-x-6 flex-row flex-nowrap overflow-auto justify-between">
          {newReleases.albums.items.map((r) => (
            <Link href={`/album/${r.id}`}>
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
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div>Something went wrong</div>
      )}
    </div>
  );
};

export default NewReleases;
