import { deleteAllCookies, setCookie } from '@/utils/cookies';
// @ts-ignore
import { history, useModel } from '@umijs/max';
import { useRequest } from 'ahooks';
import { flushSync } from 'react-dom';
import services from "@/services/auth";
const { authenticate } =
  services.AuthController;

export default () => {
  const { setInitialState, initialState } = useModel('@@initialState');
  const { loading: loadingAuthenticate, run: doAuthenticate } = useRequest(
    async (params: any) => {
      const res: API.ApiResponse<API.AuthenticateResponse> =
        await authenticate(params);
      const { result } = res;

      // @ts-ignore
      const { accessToken, refreshToken } = result;
      if (accessToken) {
        setCookie("accessToken", accessToken, 20);
        setCookie("refreshToken", refreshToken, 24 * 60);
        const { replace } = history;
        // @ts-ignore
        const { fetchUserInfo } = initialState;
        const profile = await fetchUserInfo?.();

        // @ts-ignore
        setInitialState((s) => ({ ...s, accessToken: accessToken, currentUser: profile }));
        replace('/');
      }
    },
    {
      manual: true,
    },
  );

  const logOut = () => {
    deleteAllCookies();
    flushSync(() => {
      setInitialState((s: any) => ({ ...s, currentUser: undefined }));
    });
  };

  return {
    loadingAuthenticate,
    doAuthenticate,
    logOut,
  };
};
