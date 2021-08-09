import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import useGetApi from "../../lib/useGetApi";
import { AlbumInfo } from "../../types/AlbumInfo";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { RecentlyReviewedType } from "../../types/RecentlyReviewed";
import { ApiContext } from "../Contexts/ApiContext";
import DefaultImage from "../DefaultImage";

interface AxiosResponse {
  albums: AlbumInfo[];
}

interface AlbumInfoShort {
  [key: string]: { name: string; image: string; artist: string };
}

const RecentlyReviewed: React.FC = () => {
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const [recents, setRecents] = useState<null | RecentlyReviewedType>(null);
  const [albumInfo, setAlbumInfo] = useState<AlbumInfoShort>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRecentlyReviewed = async () => {
      if (!clientToken) {
        return;
      }

      const res = await fetch("/api/review/recents");

      if (res.ok) {
        const tmpRecents = (await res.json()) as RecentlyReviewedType;
        setRecents(tmpRecents);
        const albumsInURL = new Set();
        let albumIdsUrl = `albums?ids=${tmpRecents[0].albumId}`;
        albumsInURL.add(tmpRecents[0].albumId);

        if (tmpRecents.length > 1) {
          for (let i = 1; i < tmpRecents.length; i++) {
            if (albumsInURL.has(tmpRecents[i].albumId)) {
              continue;
            }
            albumIdsUrl += `%2C${tmpRecents[i].albumId}`;
            albumsInURL.add(tmpRecents[i].albumId);
          }
        }
        const tmpAlbumRes = await useGetApi<AxiosResponse>(clientToken.access_token, albumIdsUrl);
        const tmpAlbumResInfo = tmpAlbumRes.data.albums;
        const tmpAlbumInfo: AlbumInfoShort = {};
        for (let i = 0; i < tmpAlbumResInfo.length; i++) {
          let tmpArtistName = tmpAlbumResInfo[i].artists[0].name
          if (tmpAlbumResInfo[i].artists.length > 1) {
            for (let j = 1; j < tmpAlbumResInfo[i].artists.length; j ++) {
              tmpArtistName += `, ${tmpAlbumResInfo[i].artists[j].name}`
            }
          }
          tmpAlbumInfo[tmpAlbumResInfo[i].id] = {
            name: tmpAlbumResInfo[i].name,
            image: tmpAlbumResInfo[i].images[1].url,
            artist: tmpArtistName
          };
        }
        setAlbumInfo(tmpAlbumInfo);
      }
      setLoading(false);
    };
    getRecentlyReviewed();
  }, [clientToken]);

  return (
    <div className="max-w-9/10 md:w-10/12 3xl:w-7/10 mx-auto mt-3">
      <h1 className="text-text font-medium text-xl mb-2">Recently Reviewed:</h1>
      {loading ? (
        <div>loading</div>
      ) : (
        <ul className="flex flex-row w-full gap-x-3 xl:gap-x-12 flex-wrap">
          {recents?.map((r) => (
            <li key={r.createdAt} className="mt-3 w-full md:w-48% mx-auto">
              <div className="flex flex-row gap-x-4">
                <div className="flex-none">
                  <Image
                    src={albumInfo[r.albumId].image}
                    width={110}
                    height={110}
                    className="rounded-md"
                  />
                </div>
                <div className="flex flex-col w-11/12">
                  <Link href={`/${r.author.accounts[0].providerAccountId}`}>
                    <a className="flex flex-none mb-1">
                      {r.author.image ? (
                        <Image
                          src={r.author.image}
                          width={30}
                          height={30}
                          className="rounded-full"
                        />
                      ) : (
                        <DefaultImage height={30} width={30} className="rounded-full" />
                      )}
                      <span className="font-medium text-sm ml-1.5 my-auto truncate w-10/12">{r.author.name}</span>
                    </a>
                  </Link>
                  <Link
                    href={{
                      pathname: "album/[slug]",
                      query: {
                        slug: r.albumId,
                      },
                    }}
                  >
                    <a className="text-text font-medium text-2xl tracking-tight hover:underline truncate w-10/12 -mb-0.5">
                      {albumInfo[r.albumId].name}
                    </a>
                  </Link>
                  <span className="-mb-0.5 text-sm">by {albumInfo[r.albumId].artist}</span>
                  {r.rating != 0 ? (
                    <ReactStars value={r.rating} edit={false} isHalf={true} size={18} />
                  ) : (
                    <span className="text-sm italic mt-1">Only written review</span>
                  )}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-line">{r.review}</p>
              <hr className="my-3 border-lightgrey2"/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentlyReviewed;