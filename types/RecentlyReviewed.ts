
export type RecentlyReviewedType = [RecentReview]

export interface RecentReview {
  author: {image: string | null, name: string, accounts:[{providerAccountId: string}]},
  rating: number, 
  review: string,
  albumId: string,
  likes: number,
  authorId: number
  createdAt: string
  updatedAt: string
}