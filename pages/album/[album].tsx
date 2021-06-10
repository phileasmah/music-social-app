import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useContext, useEffect, useState } from "react";
import { ApiContext } from "../../components/Contexts/ApiContext";
import DefaultImage from "../../components/DefaultImage";
import Error from "../../components/Error";
import Rating from "../../components/Rating";
import Reviews from "../../components/Reviews";
import useGetApi from "../../lib/useGetApi";
import { AlbumInfo } from "../../types/AlbumInfo";
import { AlbumReview } from "../../types/AlbumReview";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { UserReview } from "../../types/UserReview";

interface URLProps extends ParsedUrlQuery {
  album: string;
}

interface Props {
  reviews: AlbumReview | null;
}

export const getServerSideProps: GetServerSideProps<{}, URLProps> = async (context) => {
  const axios = require("axios");
  const res = (await axios({
    url: `api/review/${context.params?.album}`,
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  })) as AxiosResponse;
  if (res.status == 200) {
    const reviews = res.data;
    return {
      props: { reviews },
    };
  } else {
    const reviews = null;
    return {
      props: { reviews },
    };
  }
};

const Album: React.FC<Props> = ({ reviews }) => {
  const { clientToken } = useContext(ApiContext) as ApiContextProvider;
  const [session, loading] = useSession();
  const router = useRouter();
  const query = router.query.album;
  const [data, setData] = useState<AlbumInfo | null>(null);
  const [error, setError] = useState(false);
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  useEffect(() => {
    if (!clientToken || !query) return;
    const getData = async () => {
      const res = await useGetApi<AlbumInfo>(clientToken?.access_token, `albums/${query}`);
      if (res.status == 200) {
        const response = res.data;
        setData(response);
      } else {
        setError(true);
      }
    };
    getData();
  }, [clientToken, query]);

  useEffect(() => {
    if (loading) return;

    const getUserReview = async () => {
      setUserDataLoading(true);
      const res = await fetch("/api/user/review", {
        method: "POST",
        body: JSON.stringify({
          albumId: query,
          authorId: session?.user?.sub,
        }),
      });
      if (res.status === 200) {
        const data = (await res.json()) as UserReview;
        setUserReview(data);
        setUserDataLoading(false);
      } else {
        setUserReview(null);
        setUserDataLoading(false);
      }
    };

    if (session) {
      getUserReview();
    }
  }, [loading, query]);

  return (
    <div>
      {error && <Error />}
      {data && (
        <main className="w-11/12 lg:w-2/3 min-w-20 m-auto flex flex-col sm:flex-row max-w-6xl mt-9 items-start justify-center">
          <div className="sm:sticky sm:top-24">
            {data.images.length != 0 ? (
              <Image
                src={data.images[1].url}
                alt={"Picture of " + data.name}
                width={280}
                height={280}
                className="rounded-lg"
              />
            ) : (
              <DefaultImage />
            )}
            <h1>
              <b className="text-2xl">{data.name}</b>
              <div className="text-lg">
                {data.artists[0].name}
                {data.artists.length > 1 &&
                  data.artists
                    .slice(1)
                    .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                &nbsp; <span className="">·</span> &nbsp;{data.release_date.slice(0, 4)}
              </div>
            </h1>
            {session ? (
              !userDataLoading && (
                <div className="-mt-2">
                  <Rating
                    userRating={userReview ? userReview.rating : 0}
                    albumId={data.id}
                    userId={session.user.sub}
                  />
                </div>
              )
            ) : (
              <div>Log in to review</div>
            )}
            <div>
              {reviews ? (
                <>
                  {" "}
                  Average ratings: {reviews[1].avg.rating?.toFixed(1)}, based on{" "}
                  {reviews[1].count.rating} users{" "}
                </>
              ) : (
                <>No ratings made for this album yet</>
              )}
            </div>
          </div>
          <div className="flex-grow max-w-xl lg:ml-5">
            <h2 className="text-xl font-medium">Tracklist: </h2>
            <ul className="max-h-96 overflow-auto mt-1">
              {data.tracks.items.map((item, idx) => (
                <li key={item.id} className="grid grid-cols-10 gap-1 mt-1">
                  <span className="m-4 ml-0 sm:ml-4">{idx + 1}</span>
                  <div className="col-span-9">
                    <span className="text-text font-medium">{item.name}</span>
                    <div>
                      {item.artists[0].name}
                      {item.artists.length > 1 &&
                        item.artists
                          .slice(1)
                          .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            {reviews ? <Reviews reviews={reviews} query={query}/> : <div>No reviews made yet</div>} 
          </div>
        </main>
      )}
    </div>
  );
};

export default Album;
