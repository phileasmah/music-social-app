import Image from "next/image";
import Link from "next/link";
import ReactStars from "react-rating-stars-component";
import { AlbumReview } from "../../types/AlbumReview";
import DefaultImage from "../DefaultImage";

interface Props {
  reviews: AlbumReview;
}

const Reviews: React.FC<Props> = ({ reviews }) => {
  return (
    <div className="mt-9">
      <h2 className="text-xl font-medium">Recent Reviews:</h2>
      {reviews[0].length !== 0 ? (
        <ul>
          {reviews[0].map((review) => (
            <li
              key={review.authorId}
              className="border-2 border-lightgrey2 rounded-md p-4 w-full my-3"
            >
              <div className="flex space-x-4">
                <div className="flex-none ">
                  {review.author.image ? (
                    <Image
                      src={review.author.image}
                      width={39}
                      height={39}
                      className="rounded-full"
                    />
                  ) : (
                    <DefaultImage height={39} width={39} className="rounded-full"/>
                  )}
                </div>
                <div className="inline-block">
                  <div className="flex">
                    <span className="text-sm font-normal mr-2">
                      Review by{" "}
                      <Link href={`/${review.author.accounts[0].providerAccountId}`}>
                        <a className="text-sm font-medium text-text">{review.author.name}</a>
                      </Link>
                    </span>
                    {review.rating !== 0 && (
                      <span className="-mt-1">
                        <ReactStars value={review.rating} edit={false} isHalf={true} size={17} />
                      </span>
                    )}
                  </div>
                  <div className="mt-3 whitespace-pre-line">{review.review}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No written reviews made yet</div>
      )}
    </div>
  );
};

export default Reviews;
