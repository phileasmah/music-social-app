export type FollowersType = [Followers]

export interface Followers {
  followers: User[]
  _count: {followers: number}
}

export interface User { 
  followingId: string,
}