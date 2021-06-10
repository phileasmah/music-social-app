import Image from "next/image";
import { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { AlbumReview } from "../types/AlbumReview";
import ReviewsLoading from "./ReviewsLoading";

interface Props {
  reviews: AlbumReview;
  query: string | string[] | undefined;
}

interface ReviewUserInfo {
  [key: string]: ReviewUser;
}

interface ReviewUser {
  name: string;
  image: string;
  id: string;
}

type ReviewUserResponse = ReviewUser[];

const Reviews: React.FC<Props> = ({ reviews, query }) => {
  const [reviewUserInfo, setReviewUserInfo] = useState<ReviewUserInfo | null>(null);

  useEffect(() => {
    setReviewUserInfo(null);
    if (reviews[0].length === 0) {
      setReviewUserInfo({});
      return;
    }
    const getRecentUsers = async () => {
      const userIds = [];
      for (let i = 0; i < reviews[0].length; i++) {
        userIds.push(reviews[0][i].authorId);
      }
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          authordId: userIds,
        }),
      });
      if (res.status === 200) {
        const tmpObj: ReviewUserInfo = {};
        const data = (await res.json()) as ReviewUserResponse;
        for (let user of data) {
          tmpObj[user.id] = user;
        }
        setReviewUserInfo(tmpObj);
      }
    };

    getRecentUsers();
  }, [query]);

  return (
    <div className="mt-9">
      <h2 className="text-xl font-medium">Recent Reviews:</h2>
      {reviewUserInfo ? (
        reviews[0].length !== 0 ? (
          <ul>
            {reviews[0].map((review) => (
              <li
                key={review.authorId}
                className="border-2 border-lightgrey2 rounded-md p-4 w-full my-3"
              >
                <div className="flex space-x-4">
                  <div className="flex-none ">
                    {reviewUserInfo[review.authorId].image ? (
                      <Image
                        src={reviewUserInfo[review.authorId].image}
                        width={39}
                        height={39}
                        className="rounded-full"
                      />
                    ) : (
                      <Image
                        src={"/default_profile_pic.png"}
                        width={39}
                        height={39}
                        className="rounded-full"
                      />
                    )}
                  </div>
                  <div className="inline-block">
                    <div className="flex">
                      <span className="text-sm font-normal mr-2">
                        Review by{" "}
                        <span className="text-sm font-medium text-text">
                          {reviewUserInfo[review.authorId].name}{" "}
                        </span>
                      </span>
                      <span className="-mt-1"><ReactStars value={review.rating} edit={false} isHalf={true} size={17}/></span>
                    </div>
                    <div className="mt-3">{review.review}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>No written reviews made yet</div>
        )
      ) : (
        <ReviewsLoading />
      )}
    </div>
  );
};

export default Reviews;
