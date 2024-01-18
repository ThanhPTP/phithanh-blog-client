// App
// Global initialization data configuration, used for Layout user information and permission initialization
// Documentation：https://umijs.org/docs/api/runtime-config#getinitialstate
import RightContent from '@/components/RightContent';
import services from "@/services/auth";
import logo from './assets/images/Ico_app.svg';
import { getCookie, setCookie } from '@/utils/cookies';
// @ts-ignore
import type { AxiosRequestConfig, RequestConfig } from 'umi';
import { notification } from 'antd';
// @ts-ignore
import { getRequestInstance, history } from '@umijs/max';
import {
  // @ts-ignore
  BasicLayoutProps,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import defaultSettings from '../config/defaultSettings';
import tokenLayout from './tokenLayout';

const { getProfile, getRefreshToken } =
  services.AuthController;

const loginPath = '/login';
export async function getInitialState(): Promise<{
  accessToken: string,
  currentUser: API.GetProfileResponse,
  fetchUserInfo?: () => Promise<API.GetProfileResponse | undefined>,
  settings?: Partial<LayoutSettings>
}> {
  let accessToken = getCookie("accessToken");
  let currentUser: API.GetProfileResponse;

  const fetchUserInfo = async () => {
    try {
      const resUser = await getProfile({});
      const { result } = resUser;
      return {
        ...result,
      };
    } catch (error) {
      history.push(loginPath);
    }
  };

  if (accessToken) {
    const { location } = history;
    const currentUser = await fetchUserInfo();
    if (location.pathname === loginPath) {
      history.push('/');
    }
    return {
      accessToken,
      // @ts-ignore
      currentUser,
      // @ts-ignore
      fetchUserInfo,
      settings: defaultSettings as any,
    };
    // }
  } else {
    if (location.pathname !== '/sign-up'
      && location.pathname !== loginPath) {
      history.push(loginPath);
    }
  }

  return {
    accessToken,
    // @ts-ignore
    currentUser,
    // @ts-ignore
    fetchUserInfo,
    settings: defaultSettings as any,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.GetProfileResponse };
}): BasicLayoutProps => {
  const accessToken = getCookie("accessToken");
  return {
    rightContentRender: () => <RightContent />,
    token: tokenLayout,
    menuHeaderRender: undefined,
    logoStyle: {
      height: '53px'
    },
    logo: logo,
    onPageChange: () => {
      const { location } = history;
      if (!accessToken && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    ...initialState?.settings,
  };
};

const handleRequest = async (config: AxiosRequestConfig) => {
  const accessToken = getCookie("accessToken");
  if (accessToken && !config.headers!.Authorization) {
    config.headers!.Authorization = `Bearer ${accessToken}`;
  }
  // @ts-ignore
  config.url = `${APPLICATION_API}${config.url}`;
  return config;
};

const errorHandler = async (error: any) => {
  const { response = {} } = error;
  // const { status, config, data } = response;
  const { data } = error;
  if (data?.Message) {
    switch (data?.StatusCode) {
      case 400:
        notification.error({ message: data?.Message, duration: 3 });
        break;
      default:
        notification.error({
          message:
            'An error has occurred during processing. Please try again later.',
          duration: 3,
        });
        break;
    }
  }
  if (response.status === 401) {
    history.push('/login');
  }
};

export const request: RequestConfig = {
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
  errorConfig: {
    errorHandler,
  },
  requestInterceptors: [handleRequest],
  responseInterceptors: [
    // @ts-ignore
    [(response) => {
      return response
    },
    // @ts-ignore
    async (error: any) => {
      const orgConfig = error.config;
      const _refreshToken = getCookie("refreshToken");
      const _accessToken = getCookie("accessToken");
      if (error.response) {
        if (error.response.status === 401 && _refreshToken && !orgConfig._retry) {
          orgConfig._retry = true;
          // eslint-disable-next-line no-useless-catch
          try {
            const params = {
              accessToken: _accessToken,
              refreshToken: _refreshToken
            }
            const response = await getRefreshToken(params);
            const { result } = response;
            if (!result) throw error;

            setCookie("accessToken", result.accessToken, 20);
            setCookie("refreshToken", result.refreshToken, 24 * 60);
            return getRequestInstance()(orgConfig);
          } catch (e) {
            throw e;
          }
        }
      }
      return Promise.reject(error);
    },
    ]
  ]
};