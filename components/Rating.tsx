import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/outline";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";

interface Props {
  userRating: number;
  albumId: string;
  userId: string;
}

const Rating: React.FC<Props> = ({ userRating, albumId, userId }) => {
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
    <>
      <ReactStars value={userRating} size={40} isHalf={true} onChange={handleChange} />
      {loading &&
        <svg
          className="animate-spin w-4 h-4 -mt-9 ml-44 rounded-full bg-transparent border-2 border-transparent border-opacity-50"
          style={{borderRightColor: "#9CA3AF", borderTopColor: "#9CA3AF"}}
          viewBox="0 0 20 20"
        ></svg>
      }
      {resSuccess === true && !loading && <CheckCircleIcon className="w-5 h-5 -mt-9 ml-44 text-green-500" />}
      {resSuccess === false && !loading && (
        <ExclamationCircleIcon className="w-5 h-5 -mt-9 ml-44 text-red-500" />
      )}
    </>
  );
};

export default Rating;
