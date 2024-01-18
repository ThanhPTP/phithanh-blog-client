import services from '@/services';
import { LeftCircleOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormText
} from '@ant-design/pro-components';
import { message, Spin, UploadFile, Upload, Button, Form } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'umi';
import type { ProFormInstance } from '@ant-design/pro-components';
import { slugify } from '@/utils/format';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/es/upload';
import { isEmpty } from 'lodash';

const { getDetailCategory, createOrUpdateCategory } = services.CategoryController;
const { uploadFile } = services.FileController;

const CategoryForm: React.FC<unknown> = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('Tạo mới danh mục');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const formRef = useRef<
    ProFormInstance<{
      name: string;
      slug?: string;
      index?: number;
      bannerUrl?: string;
    }>>();

  useEffect(() => {
    if (params.id) {
      setTitle("Chi tiết danh mục");
    }
  });

  const handleSubmitForm = async (values: any) => {
    values.id = params.id;
    if (!isEmpty(fileList) && !isEmpty(fileList?.[0]?.originFileObj)) {
      const formData = new FormData();
      formData.append('files', fileList?.[0]?.originFileObj as File);
      formData.append('thumbSizes', '300');
      const res = await uploadFile(formData);
      const { result } = res
      if (result?.paths) {
        values.bannerUrl = result?.paths?.[0];
        const { success } = await createOrUpdateCategory(values);
        if (success) {
          message.success('Thành công');
          history.back();
        }
        else {
          message.error('Không thành công');
        }
      }
    }
    else {
      values.bannerUrl = fileList?.[0]?.url;
      const { success } = await createOrUpdateCategory(values);
      if (success) {
        message.success('Thành công');
        history.back();
      }
      else {
        message.error('Không thành công');
      }
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG/JPG file!');
    }
    return isJpgOrPng;
  };

  const handleChange: UploadProps['onChange'] = async (info: UploadChangeParam<UploadFile>) => {
    const { file, fileList } = info
    if ((file?.size || 0) / 1024 / 1024 > 10) {
      message.error('Image must smaller than 10MB!');
      return;
    }
    setFileList(fileList);
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
                const { result, success } = await getDetailCategory({ id: params.id });
                setFileList([{ key: '1', url: result?.bannerUrl, name: 'image', status: 'done' }] as any);
                setLoading(false);

                if (success) {
                  return result;
                }
              }

              return {};
            }}>
            <ProFormText
              required
              fieldProps={{
                onChange: (e) => {
                  formRef.current?.setFieldValue('slug', slugify(e.target.value))
                }
              }}
              width="lg"
              name="name"
              label="Tên"
              placeholder="Nhập tên danh mục"
              rules={[{ required: true, message: 'Xin nhập tên danh mục' }]}
            />
            <ProFormText
              required
              width="lg"
              name="slug"
              label="Đường dẫn"
              placeholder="Nhập đường dẫn (vd: cach-de-day-hoc-hieu-qua)"
              rules={[{ required: true, message: 'Xin nhập đường dẫn' }]}
            />
            <Form.Item
              required
              label="Hình nền"
              name="bannerUrl"
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={beforeUpload}
                name="bannerUrl"
                showUploadList={{
                  showRemoveIcon: false,
                }}
                itemRender={(originNode, file, fileList, actions) => <div className='relative w-full h-full'>
                  {originNode}
                  <Button
                    type="text"
                    icon={<CloseCircleOutlined />}
                    className="absolute text-red-dark-25 -top-3 -right-3"
                    onClick={actions.remove}
                  >
                  </Button>
                </div>
                }
              >
                {fileList?.length >= 1 ? null : uploadButton}
              </Upload>
            </Form.Item>
          </ProForm>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default CategoryForm;
