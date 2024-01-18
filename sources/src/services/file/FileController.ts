/* eslint-disable */
import { request } from '@umijs/max';

export async function uploadFile(params: FormData) {
  return request('/api/v1/file/upload-files', {
    method: 'POST',
    data: params,
    requestType: 'form',
  });
}
