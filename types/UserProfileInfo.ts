
export type UserProfileArr = [UserProfile]

export interface UserProfile {
  id: string,
  image: string,
  name: string,
  reviews: Review[]
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
