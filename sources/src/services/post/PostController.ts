/* eslint-disable */
import { request } from '@umijs/max';

export async function getListPosts(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.PagingResult<API.GetListPostsResponse>>>('/api/v1/post/get-list-posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getDetailPost(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.GetDetailPostResponse>>('/api/v1/post/get-detail-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function createOrUpdatePost(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/post/create-or-update-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deletePost(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/post/delete-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteBatchPosts(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/post/delete-batch-posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}