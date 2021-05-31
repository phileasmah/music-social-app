import "next-auth";

declare module "next-auth" {

  interface Session {
    user: {
      name: string;
      email: string;
      picture?: null;
      sub: string;
      id: string;
      accessToken: string;
      refreshToken: string;
      accessTokenExpires: number;
      iat: number;
      exp: number;
    },
    expires: string
  }
}
