import { useEffect, useState } from "react";
import { AlbumReview } from "../types/AlbumReview";

interface Props {
  reviews: AlbumReview;
}

type reviewUserInfo = reviewUser[]

interface reviewUser { 
  name: string,
  image: string,
  id: string
}

const Reviews: React.FC<Props> = ({ reviews }) => {

  const [reviewUserInfo, setReviewUserInfo] = useState<reviewUserInfo>([])

  useEffect(() => {
    if (reviews[0].length === 0) return;

    const getRecentUsers = async() => {
      const userIds = []
      for (let i = 0; i < reviews[0].length; i++) {
        userIds.push(reviews[0][i].authorId);
      }
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({
          authordId: userIds
        })
      })
      if (res.status === 200) {
        const tmpObj = {}
        const data = await res.json() as reviewUserInfo;
        setReviewUserInfo(data);
        console.log(data);
      }
    }

    getRecentUsers();
  }, [])
  return (
    <div className="mt-9">
      <h2 className="text-xl font-medium">Recent Reviews:</h2>
      {
        reviews[0].length !== 0 ? 
        <ul>
        {reviews[0].map((review) => (
          <li key={review.authorId}>{review.review}</li>
        ))}
      </ul> : <div>No written reviews made yet</div>
      }

    </div>
  );
};

export default Reviews;
