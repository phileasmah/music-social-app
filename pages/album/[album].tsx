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
import useGetApi from "../../lib/useGetApi";
import { AlbumInfo } from "../../types/AlbumInfo";
import { AlbumReview } from "../../types/AlbumReview";
import { ApiContextProvider } from "../../types/ApiContextProvider";
import { UserReview } from "../../types/UserReview";

interface URLProps extends ParsedUrlQuery {
  album: string;
}

interface Props {
  reviews: AlbumReview | false;
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
    const reviews = false;
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
  }, [clientToken]);

  useEffect(() => {
    if (loading) return;

    const getUserReview = async () => {
      const res = await fetch("/api/user/review", {
        method: "POST",
        body: JSON.stringify({
          albumId: query,
          authorId: parseInt(session?.user?.sub as string),
        }),
      });
      if (res.status === 200) {
        const data = (await res.json()) as UserReview;
        setUserReview(data);
      }
    };

    if (session) {
      getUserReview();
    }
  }, [loading]);

  return (
    <div>
      {error && <Error />}
      {data && (
        <main className="w-1/2 m-auto">
          <div className="flex">
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
            <h1 className="text-2xl">
              <b>{data.name}</b>
            </h1>
          </div>
          {reviews ? (
            <h2>
              Average ratings: {reviews[1].avg.rating}, based on {reviews[1].count.rating} users
            </h2>
          ) : (
            <h2>No ratings made for this album yet</h2>
          )}
          {session ? (
            userReview ? (
              <h3>Your review: {userReview.rating}</h3>
            ) : (
              <h3>No review made yet</h3>
            )
          ) : (
            <h3>Log in to review</h3>
          )}
        </main>
      )}
    </div>
  );
};

export default Album;
