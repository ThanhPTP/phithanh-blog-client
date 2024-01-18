import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
  headerHeight?: number;
} = {
  navTheme: 'light',
  colorPrimary: '#1a72bd',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  pwa: false,
  iconfontUrl: '',
  headerHeight: 53,
  siderWidth: 280,
};
export default Settings;
