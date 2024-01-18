import { ProConfigProvider } from '@ant-design/pro-components';
import { Button, Form, Input } from 'antd';
import styles from './index.less';
import { KeyOutlined, UserOutlined } from '@ant-design/icons';
import { Helmet, useModel } from '@umijs/max';

export default () => {
  const { doAuthenticate, loadingAuthenticate } = useModel('auth');

  const onFinish = async (values: any) => {
    doAuthenticate(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <ProConfigProvider hashed={false}>
      <Helmet title="Đăng nhập" />
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <Form
            name="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className={styles.loginHeaderBox}>
              <p className={styles.loginHeader}>CMS Admin</p>
            </div>

            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Vui lòng nhập tài khoản!' },
              ]}
            >
              <Input
                addonBefore={<UserOutlined style={{ fontSize: '16px' }} />}
                style={{ width: '100%' }}
                placeholder="Tài khoản"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu!' },
              ]}
            >
              <Input.Password
                addonBefore={<KeyOutlined style={{ fontSize: '16px' }} />}
                style={{ width: '100%' }}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button
                className={styles.loginBtn}
                type="primary"
                htmlType="submit"
                size="large"
                loading={loadingAuthenticate}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </ProConfigProvider>
  );
};
