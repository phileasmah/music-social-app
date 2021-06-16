import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { useSession } from "next-auth/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useContext, useEffect, useState } from "react";
import Rating from "../../components/AlbumPage/Rating";
import Reviews from "../../components/AlbumPage/Reviews";
import { ApiContext } from "../../components/Contexts/ApiContext";
import DefaultImage from "../../components/DefaultImage";
import Error from "../../components/Error";
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

  let reviews;
  if (res.status == 200) {
    reviews = res.data;
  } else {
    reviews = null;
  }
  return {
    props: { reviews },
  };
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

  const millisToMinutesAndSeconds = (milli: number) => {
    const minutes = Math.floor(milli / 60000);
    const seconds = Math.floor((milli % 60000) / 1000);
    return seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <div>
      {error && <Error />}
      {data && (
        <main className="w-full md:w-11/12 lg:w-4/5 xl:w-2/3 min-w-20 m-auto flex flex-col md:flex-row max-w-6xl mt-9 md:items-start md:justify-center md:gap-x-5">
          <div className="mx-auto w-full md:w-auto md:m-0 md:sticky md:top-24 md:flex-none">
            <div className="w-max mx-auto">
              <div className="w-max mx-auto">
                {data.images.length != 0 ? (
                  <Image
                    src={data.images[1].url}
                    alt={"Picture of " + data.name}
                    width={280}
                    height={280}
                    className="rounded-lg"
                  />
                ) : (
                  <DefaultImage width={280} height={280} className="rounded-lg" />
                )}
              </div>
              <h1 className="max-w-3/4 md:max-w-2xs text-center md:text-left">
                <div className="max-w-3/4  w-max mx-auto md:w-auto md:mx-0">
                  <b className="text-2xl">{data.name}</b>
                </div>
                <div className="text-lg max-w-3/4 w-max mx-auto md:w-auto">
                  {data.artists[0].name}
                  {data.artists.length > 1 &&
                    data.artists
                      .slice(1)
                      .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                  &nbsp; <span className="">·</span> &nbsp;{data.release_date.slice(0, 4)}
                </div>
              </h1>
            </div>

            <div className="w-max mx-auto">
              {session ? (
                !userDataLoading ? (
                  <div className="-mt-3 w-max mx-auto">
                    <Rating
                      rating={userReview ? userReview.rating : null}
                      review={userReview?.review ? userReview.review : ""}
                      albumId={data.id}
                      userId={session.user.sub}
                    />
                  </div>
                ) : (
                  <div className="w-70 my-2 animate-pulse">
                    <div className="h-9 mb-4 bg-lightgrey2 rounded"></div>
                    <div className="h-40 bg-lightgrey2 rounded"></div>
                  </div>
                )
              ) : (
                <div className="my-1 font-medium text-text  ">Log in to review</div>
              )}
            </div>

            <div className="mx-auto w-max">
              {reviews ? (
                <>
                  Average ratings: {reviews[1].avg.rating?.toFixed(1)}, based on{" "}
                  {reviews[1].count.rating} users{" "}
                </>
              ) : (
                <>No ratings made for this album yet</>
              )}
            </div>
          </div>
          <div className="flex-grow w-11/12 md:w-auto mx-auto md:mx-0 mt-3 md:mt-0 md:max-w-2xl">
            <h2 className="text-xl font-medium">Tracklist: </h2>
            <ul className="max-h-96 overflow-auto mt-1 duration-200">
              {data.tracks.items.map((item, idx) => (
                <li
                  key={item.id}
                  className={`grid grid-cols-10 rounded-lg py-2 ${
                    idx % 2 == 0 && "border-2 border-lightgrey"
                  }`}
                >
                  <span className="col-span-1 my-auto ml-3 lg:ml-5">{idx + 1}</span>
                  <div className="col-span-8 my-auto mr-3 md:mr-2 ml-2">
                    <span className="text-text font-semibold">{item.name}</span>
                    <div>
                      {item.artists[0].name}
                      {item.artists.length > 1 &&
                        item.artists
                          .slice(1)
                          .map((artist) => <span key={artist.id}>, {artist.name}</span>)}
                    </div>
                  </div>
                  <div className="col-span-1 my-auto font-medium -ml-2 md:ml-0">
                    {millisToMinutesAndSeconds(item.duration_ms)}
                  </div>
                </li>
              ))}
            </ul>
            {reviews ? <Reviews reviews={reviews} query={query} /> : <div>No reviews made yet</div>}
          </div>
        </main>
      )}
    </div>
  );
};

export default Album;
