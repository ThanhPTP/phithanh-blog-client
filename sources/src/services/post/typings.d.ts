/* eslint-disable */

declare namespace API {
  interface GetListPostsResponse {
    id?: string;
    title?: string;
    tags: string[];
    displayDate?: Date,
    status: string,
    createdDate?: Date;
    modifiedDate?: Date;
  }

  interface GetDetailPostResponse {
    id?: string;
    title?: string;
    content?: string;
    bannerUrl?: string;
    createdDate?: Date;
    modifiedDate?: Date;
  }
}
