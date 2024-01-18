/* eslint-disable */
import { request } from '@umijs/max';

export async function getListTags(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.PagingResult<API.GetListTagsResponse>>>('/api/v1/tag/get-list-tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getDetailTag(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.GetDetailTagResponse>>('/api/v1/tag/get-detail-tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function createOrUpdateTag(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/tag/create-or-update-tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteTag(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/tag/delete-tag', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteBatchTags(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/tag/delete-batch-tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}