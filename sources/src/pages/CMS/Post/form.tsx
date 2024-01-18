import services from '@/services';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  PageContainer,
  ProCard,
} from '@ant-design/pro-components';
import React, { useState, useEffect, useRef } from 'react';
import { LeftCircleOutlined, CloseCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams, useModel } from 'umi';
import {
  message, Spin, Upload,
  Form,
  UploadFile, Button
} from 'antd';
import { RcFile, UploadChangeParam, UploadProps } from 'antd/es/upload';
// @ts-ignore
import { isEmpty } from 'lodash';
import { slugify } from '@/utils/format';
import type { ProFormInstance } from '@ant-design/pro-components';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const { getDetailPost, createOrUpdatePost } = services.PostController;
const { getListCategories } = services.CategoryController;
const { uploadFile } = services.FileController;

const PostForm: React.FC<unknown> = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Tạo mới bài viết");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { initialState } = useModel('@@initialState');
  const [content, setContent] = useState('');

  const formRef = useRef<
    ProFormInstance<{
      name: string;
      slug?: string;
      bannerUrl?: string;
      categoryId?: string;
      content?: string;
    }>>();

  useEffect(() => {
    if (params.id) {
      setTitle("Chi tiết bài viết");
    }
  });

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

  const handleSubmitForm = async (values: any) => {
    values.id = params.id;
    console.log(fileList?.[0])
    if (!isEmpty(fileList) && !isEmpty(fileList?.[0]?.originFileObj)) {
      const formData = new FormData();
      formData.append('files', fileList?.[0]?.originFileObj as File);
      formData.append('prefixPath', 'media');
      // @ts-ignore
      formData.append('deviceId', initialState?.currentUser?.deviceId);
      const res = await uploadFile(formData);
      const { result } = res
      if (result?.paths) {
        values.bannerUrl = result?.paths?.[0];
        values.content = content;
        const { success } = await createOrUpdatePost(values);
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
      values.content = content;
      const { success } = await createOrUpdatePost(values);
      if (success) {
        message.success('Thành công');
        history.back();
      }
      else {
        message.error('Không thành công');
      }
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <PageContainer
      header={{
        title: <div><LeftCircleOutlined onClick={() => { history.back() }} /> {title}</div>
      }}
    >
      <Spin spinning={loading}>
        <ProCard boxShadow >
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
                const { result, success } = await getDetailPost({ id: params.id });
                // @ts-ignore
                setContent(result?.content);
                setFileList([{ key: '1', url: result?.bannerUrl, name: 'image', status: 'done' }] as any);
                setLoading(false);
                if (success) {
                  return result;
                }
              }

              return {};
            }}>
            <ProFormText
              fieldProps={{
                onChange: (e) => {
                  formRef.current?.setFieldValue('slug', slugify(e.target.value))
                }
              }}
              required
              width="lg"
              name="title"
              label="Tiêu đề"
              placeholder="Nhập tiêu đề"
              rules={[{ required: true, message: 'Xin nhập tiêu đề' }]}
            />
            <ProFormSelect
              required
              width="lg"
              name="categoryId"
              // @ts-ignore
              request={async () => {
                const { result, success } = await getListCategories({});
                if (success) {
                  return result?.data?.map(s => {
                    return {
                      value: s.id,
                      label: s.name
                    }
                  });
                }

                return [];
              }}
              label="Danh mục"
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
            <ProFormText
              required
              width="lg"
              name="slug"
              label="Đường dẫn"
              placeholder="Nhập đường dẫn (vd: cach-de-day-hoc-hieu-qua)"
              rules={[{ required: true, message: 'Xin nhập đường dẫn' }]}
            />
            {/* <ProFormText
              width="lg"
              name="content"
              label="Nội dung"
              placeholder="Nhập nội dung"
            /> */}
            <ReactQuill
              theme="snow"
              style={{ height: "500px", marginBottom: "50px" }}
              value={content}
              onChange={setContent} />
          </ProForm>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default PostForm;
