import { useState } from "react";

interface Props {
  userReview: string;
  handler: (newRating: number | null, newReview: string | null) => Promise<void>;
  loading: boolean;
}

const RatingReview: React.FC<Props> = ({ userReview, handler, loading }) => {
  const [textAreaInput, setTextAreaInput] = useState("");

  const handleSubmit = () => {
    const cleanInput = textAreaInput.trim();
    if (cleanInput === userReview || cleanInput === "") return;
    handler(null, textAreaInput);
  };

  const handleDelete = () => {
    handler(null, "");
  };

  return (
    <div className="flex flex-col">
      <textarea
        readOnly={loading}
        className="resize-none bg-lightgrey rounded-lg p-3 w-70 h-40 duration-200 transform max-w-9/10 focus:h-60 focus:w-96 md:focus:w-80 lg:focus:w-96"
        defaultValue={userReview}
        onChange={(e) => {
          setTextAreaInput(e.target.value);
        }}
        placeholder="Write your review..."
      ></textarea>
      <div className="flex justify-center gap-x-3">
        {userReview && !loading && (
          <button
            onClick={handleDelete}
            className="text-red-500 border-red-500 mt-3 mb-2 py-1 px-2 max-w-max border-2 rounded-md hover:bg-lightgrey focus:bg-lightgrey"
          >
            Delete
          </button>
        )}
        {textAreaInput && textAreaInput !== userReview && !loading && (
          <button
            onClick={handleSubmit}
            className="mt-3 mb-2 py-1 px-2 max-w-max border-2 rounded-md hover:bg-lightgrey focus:bg-lightgrey"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default RatingReview;
