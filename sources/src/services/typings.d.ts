/* eslint-disable */

declare namespace API {
  interface PagingResult<T> {
    pageIndex?: number;
    pageSize?: number;
    totalRecords?: number;
    data?: Array<T>;
  }

  interface ApiResponse<T> {
    success?: boolean;
    message?: string;
    statusCode: number;
    errors: Record<string, any>;
    result?: T;
  }
}
