/* eslint-disable */

declare namespace API {
  interface GetListCategoriesResponse {
    id?: string;
    name?: string;
    slug?: string;
    createdDate?: Date;
    modifiedDate?: Date;
  }

  interface GetDetailCategoryResponse {
    id?: string;
    name?: string;
    slug?: string;
    logoUrl?: string;
    bannerUrl?: string;
    createdDate?: Date;
    modifiedDate?: Date;
  }
}
