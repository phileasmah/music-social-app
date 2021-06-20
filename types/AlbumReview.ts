export type AlbumReview = [Review[], Avg]

export interface Review {
  author: Author,
  rating: number, 
  review?: string,
  albumId: string,
  likes: number,
  authorId: number
  createdAt: string
  updatedAt: string
}

export interface Author {
  image: string,
  name: string,
  accounts: Account[]
}

export interface Account{
  providerAccountId: string
}

export interface Avg {
  avg: {
    rating: number | null
  },
  count : {
    rating: number 
  }
}