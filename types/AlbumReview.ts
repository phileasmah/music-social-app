export type AlbumReview = [Review[], Avg]

export interface Review {
  rating: number, 
  review?: string,
  albumId: string,
  likes: number,
  authorId: number
  createdAt: string
}

export interface Avg {
  avg: {
    rating: number | null
  },
  count : {
    rating: number 
  }
}