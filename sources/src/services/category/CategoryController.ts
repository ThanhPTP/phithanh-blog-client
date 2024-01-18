/* eslint-disable */
import { request } from '@umijs/max';

export async function getListCategories(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.PagingResult<API.GetListCategoriesResponse>>>('/api/v1/category/get-list-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function getDetailCategory(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<API.GetDetailCategoryResponse>>('/api/v1/category/get-detail-category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function createOrUpdateCategory(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/category/create-or-update-category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteCategory(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/category/delete-category', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function deleteBatchCategories(
  body: {},
  options?: { [key: string]: any },
) {
  return request<API.ApiResponse<string>>('/api/v1/category/delete-batch-categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}