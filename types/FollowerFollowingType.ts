
export type FollowerFollowing = [Following]

export interface Following {
  following: Users[]
}

export interface Users { 
  name: string,
  image: string,
  accounts: [{providerAccountId: string}]
}