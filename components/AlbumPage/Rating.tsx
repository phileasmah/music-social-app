import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import { UserReview } from "../../types/UserReview";
import RatingReview from "./RatingReview";

interface Props {
  rating: number | null;
  review: string;
  albumId: string;
  userId: number;
}

const Rating: React.FC<Props> = ({ rating, review, albumId, userId }) => {
  const [resSuccess, setResSuccess] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);
  const [clearButton, setClearButton] = useState(false);
  const [userReview, setUserReview] = useState(review);
  const [userRating, setUserRating] = useState(rating);

  const handleChange = async (newRating: number | null, newReview: string | null | undefined) => {
    let method;
    setLoading(true);
    if (userRating === null) {
      method = "create";
      if (newReview !== null && newReview !== undefined) {
        newRating = 0;
      }
    } else {
      method = "update";
    }
    const res = await fetch(`/api/user/review/${method}`, {
      method: "POST",
      body: JSON.stringify({
        albumId: albumId,
        authorId: userId,
        rating: newRating,
        review: newReview
      }),
    });
    const newUserReview = await res.json() as UserReview;
    if (res.ok) {
      setResSuccess(true);
      if (newRating === null) {
        setUserReview(newUserReview.review);
      } else {
        setUserRating(newUserReview.rating);
      }
    } else {
      setResSuccess(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <div
        className="flex justify-center w-3/4 mx-auto"
        onMouseEnter={() => setClearButton(true)}
        onMouseLeave={() => setClearButton(false)}
      >
        {clearButton && (
          <button onClick={() => handleChange(0, null)} className="relative">
            <XIcon className="absolute -left-6 bottom-4 w-5 h-5 text-red-500" />
          </button>
        )}
        <ReactStars value={userRating === null ? 0 : userRating} size={40} isHalf={true} onChange={handleChange} />
        {loading && (
          <svg
            className="animate-spin w-4 h-4 ml-1.5 mt-6 rounded-full bg-transparent border-2 border-transparent border-opacity-50"
            style={{ borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF" }}
            viewBox="0 0 20 20"
          ></svg>
        )}
        {resSuccess === true && !loading && (
          <CheckCircleIcon className="w-5 h-5 ml-1.5 mt-6 text-green-500" />
        )}
        {resSuccess === false && !loading && (
          <ExclamationCircleIcon className="w-5 h-5 ml-1.5 mt-6 text-red-500" />
        )}
      </div>
      <RatingReview userReview={userReview} handler={handleChange} loading={loading} />
    </div>
  );
};

export default Rating;
