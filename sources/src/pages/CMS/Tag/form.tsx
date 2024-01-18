import services from '@/services';
import { LeftCircleOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText
} from '@ant-design/pro-components';
import { message, Spin } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'umi';
import type { ProFormInstance } from '@ant-design/pro-components';
const { getDetailTag, createOrUpdateTag } = services.TagController;
const TagForm: React.FC<unknown> = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Tạo mới thẻ');

  const formRef = useRef<
    ProFormInstance<{
      key: string;
    }>>();

  useEffect(() => {
    if (params.id) {
      setTitle("Chi tiết thẻ");
    }
  });

  const handleSubmitForm = async (values: any) => {
    values.id = params.id;
    const { success } = await createOrUpdateTag(values);
    if (success) {
      message.success('Thành công');
      history.back();
    }
    else {
      message.error('Không thành công');
    }
  };

  return (
    <PageContainer
      header={{
        title: (
          <div>
            <LeftCircleOutlined
              onClick={() => {
                history.back();
              }}
            />{' '}
            {title}
          </div>
        ),
      }}
    >
      <Spin spinning={loading}>
        <ProCard boxShadow>
          <ProForm
            formRef={formRef}
            submitter={{
              searchConfig: {
                submitText: 'Lưu',
              },
              resetButtonProps: {
                style: {
                  display: 'none',
                },
              },
              submitButtonProps: {}
            }}
            onFinish={handleSubmitForm}
            request={async () => {
              if (params.id) {
                setLoading(true);
                const { result, success } = await getDetailTag({ id: params.id });
                setLoading(false);

                if (success) {
                  return result;
                }
              }

              return {};
            }}>
            <ProFormText
              required
              width="lg"
              name="key"
              label="Tên"
              placeholder="Nhập tên thẻ"
              rules={[{ required: true, message: 'Xin nhập tên thẻ' }]}
            />
          </ProForm>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default TagForm;
