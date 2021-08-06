export type FollowingType = [Following]

export interface Followers {
  following: User[]
  _count: {following: number}
}

export interface User { 
  followerId: string,
  followingId: string,
}