import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";

interface Props {
  userRating: number;
  userReview: string;
  albumId: string;
  userId: number;
}

const Rating: React.FC<Props> = ({ userRating, userReview, albumId, userId }) => {
  const [resSuccess, setResSuccess] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = async (newRating: number) => {
    let method;
    setLoading(true);
    if (userRating === 0) {
      method = "create";
    } else {
      method = "update";
    }
    const res = await fetch(`/api/user/review/${method}`, {
      method: "POST",
      body: JSON.stringify({
        rating: newRating,
        albumId: albumId,
        authorId: userId,
      }),
    });
    setLoading(false);
    if (res.ok) {
      setResSuccess(true);
    } else {
      setResSuccess(false);
    }
  };

  return (
    <div>
      <div className="flex">
        <ReactStars value={userRating} size={40} isHalf={true} onChange={handleChange} />
        {loading && (
          <svg
            className="animate-spin w-4 h-4 ml-2 mt-6 rounded-full bg-transparent border-2 border-transparent border-opacity-50"
            style={{ borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF" }}
            viewBox="0 0 20 20"
          ></svg>
        )}
        {resSuccess === true && !loading && (
          <CheckCircleIcon className="w-5 h-5 ml-2 mt-6 text-green-500" />
        )}
        {resSuccess === false && !loading && (
          <ExclamationCircleIcon className="w-5 h-5 ml-2 mt-6 text-red-500" />
        )}
      </div>
      <textarea
        name=""
        id=""
        className="resize-none bg-lightgrey rounded-lg p-3 w-70 duration-200 transform focus:h-70"
        defaultValue={userReview}
      >
      </textarea>
    </div>
  );
};

export default Rating;
