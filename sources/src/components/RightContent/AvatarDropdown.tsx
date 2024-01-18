
import { getCookie } from '@/utils/cookies';
import { LogoutOutlined, ToolOutlined } from '@ant-design/icons';
// @ts-ignore
import { useEmotionCss } from '@ant-design/use-emotion-css';
// @ts-ignore
import { history, useModel } from '@umijs/max';
import { Avatar, Spin } from 'antd';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback, useEffect } from 'react';
import { flushSync } from 'react-dom';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const Name = (props: any) => {
  const { currentUser } = props

  // @ts-ignore
  const nameClassName = useEmotionCss(({ token }) => {
    return {
      width: '100px',
      height: '48px',
      overflow: 'hidden',
      lineHeight: '48px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      [`@media only screen and (max-width: ${token.screenMD}px)`]: {
        display: 'none',
      },
    };
  });

  return <span className={`${nameClassName} anticon`}>{currentUser?.fullName}</span>;
};

const AvatarLogo = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  // @ts-ignore
  const avatarClassName = useEmotionCss(({ token }) => {
    return {
      marginRight: '8px',
      color: token.colorPrimary,
      verticalAlign: 'top',
      [`@media only screen and (max-width: ${token.screenMD}px)`]: {
        margin: 0,
      },
    };
  });

  return <Avatar size="small" className={avatarClassName} src={(currentUser?.avatar_url && currentUser?.avatar_url !== "string") ? currentUser?.avatar_url : '/images/avatar.png'} alt="avatar" />;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {

  const { logOut } = useModel('auth');

  const loginOut = async () => {
    logOut();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;

    const redirect = urlParams.get('redirect');

    if (window.location.pathname !== '/login' && !redirect) {
      history.replace({
        pathname: '/login',
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };
  // @ts-ignore
  const actionClassName = useEmotionCss(({ token }) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },

      [`@media screen and (max-width: ${token.screenXS})`]: {
        width: '50px',

      },
    };
  });
  const { initialState = {}, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        loginOut();
        return;
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={actionClassName}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  // @ts-ignore
  const { currentUser, fetchUserInfo } = initialState;

  useEffect(() => {
    const fetchData = async () => {
      const token = getCookie("access_token");
      if (token && !currentUser?.userName) {
        const profile = await fetchUserInfo?.();
        flushSync(() => {
          // @ts-ignore
          setInitialState((s) => ({ ...s, currentUser: profile }));
        });
      }
    };

    fetchData()
  }, [fetchUserInfo, currentUser]);

  if (!currentUser || !currentUser.fullName) {
    return loading;
  }

  const menuItems = [
    ...(menu
      ? [
        {
          type: 'divider' as const,
        },
        {
          key: 'change-password',
          icon: <ToolOutlined />,
          label: 'Đổi mật khẩu',
        },
      ]
      : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <HeaderDropdown
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      overlayClassName="min-width: 300px"
    >
      <span className={actionClassName}>
        <AvatarLogo />
        <Name currentUser={currentUser} />
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
