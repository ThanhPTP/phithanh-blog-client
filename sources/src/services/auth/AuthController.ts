/* eslint-disable */
import { request } from '@umijs/max';

export async function authenticate(
    body: {
        userName?: string;
        password?: string;
    },
    options?: { [key: string]: any },
) {
    return request<API.ApiResponse<API.AuthenticateResponse>>('/api/v1/account/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function getRefreshToken(
    body: {
        accessToken?: string;
        refreshToken?: string;
    },
    options?: { [key: string]: any },
) {
    return request<API.ApiResponse<API.AuthenticateResponse>>('/api/v1/account/refresh-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}

export async function getProfile(
    body: {},
    options?: { [key: string]: any },
) {
    return request<API.ApiResponse<API.GetProfileResponse>>('/api/v1/account/get-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        data: body,
        ...(options || {}),
    });
}
