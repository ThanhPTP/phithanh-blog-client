/* eslint-disable */

declare namespace API {
  interface AuthenticateResponse {
    userId?: number,
    username: string,
    email: string,
    accessToken: string,
    accessTokenExpireAt: Date,
    refreshToken: string,
    refreshTokenExpireAt: Date
  }

  interface GetProfileResponse {
    userId?: number,
    deviceId?: number,
    username: string,
    email: string,
    fullName: string,
    avatar_url: string
  }
}
