import {
  GlobalOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
// @ts-ignore
import { SelectLang as UmiSelectLang } from '@umijs/max';
export type SiderTheme = 'light' | 'dark';

export const SelectLang = () => {
  return (
    <UmiSelectLang
      style={{
        padding: 4,
      }}
      icon={<GlobalOutlined />}
    />
  );
};

export const Question = () => {
  return (
    <div
      style={{
        display: 'flex',
        height: 26,
      }}
      onClick={() => {
        window.open('https://pro.ant.design/docs/getting-started');
      }}
    >
      <QuestionCircleOutlined />
    </div>
  );
};

// @ts-ignore
import { useModel } from '@umijs/max';
import React, { useEffect } from 'react';
// @ts-ignore
import AvatarDropdown from './AvatarDropdown';
import styles from './styles.less';

const GlobalHeaderRight: React.FC<{ isDesktop?: boolean }> = () => {
  // @ts-ignore
  const { initialState } = useModel('@@initialState');
  if (!initialState) {
    return null;
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => { }, []);
  return (
    <div className={styles.right}>
      {/* <SelectLang /> */}
      <div className={styles.block}></div>
      <AvatarDropdown />
    </div>
  );
};
export default GlobalHeaderRight;
