import ReactStars from "react-rating-stars-component";

const Rating = ({ userRating, albumId, userId }) => {
  const handleChange = async (newRating) => {
    let method;
    if (userRating === 0) {
      method = "create"
    } else {
      method = "update"
    }
    const res = await fetch(`/api/user/review/${method}`, {
      method: "POST",
      body: JSON.stringify({
        rating: newRating, 
        albumId: albumId,
        authorId: userId
      })
    });
  };

  return <ReactStars value={userRating} size={40} isHalf={true} onChange={handleChange}/>;
};

export default Rating;
