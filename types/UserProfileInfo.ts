
export type UserProfileArr = [UserProfile]

export interface UserProfile {
  id: string,
  image: string,
  name: string,
  reviews: Review[]
  _count:{
    followers: number,
    following: number,
    reviews: number
  }
}

export interface Review {
  albumId: string,
  authorId: string,
  createdAt: string,
  likes: number, 
  rating: number,
  review: string | null,
  updatedAt: string
}
