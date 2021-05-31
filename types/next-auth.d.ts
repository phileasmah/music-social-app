import "next-auth";

declare module "next-auth" {
  interface Session {
    user: JWT,
    expires: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string;
    email: string;
    sub: string;
    id: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    iat: number;
    exp: number;
  }
}
