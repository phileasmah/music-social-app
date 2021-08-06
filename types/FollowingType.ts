export type FollowingType = [Following]

export interface Following {
  following: User[]
  _count: {following: number}
}

export interface User { 
  followerId: string,
}