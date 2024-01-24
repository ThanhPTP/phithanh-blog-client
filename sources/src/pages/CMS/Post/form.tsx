import services from '@/services';
import {
  ProForm,
  ProFormSelect,
  ProFormText,
  PageContainer,
  ProCard,
  ProFormDateTimePicker
} from '@ant-design/pro-components';
import React, { useState, useEffect, useRef } from 'react';
import { LeftCircleOutlined, CloseCircleOutlined, PlusOutlined, GlobalOutlined } from '@ant-design/icons';
// @ts-ignore
import { useParams } from 'umi';
import {
  message, Spin, Upload,
  Form,
  UploadFile, Button,
  Col, Row
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
const { getListTags } = services.TagController;
const { uploadFile } = services.FileController;

const PostForm: React.FC<unknown> = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Tạo mới bài viết");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [content, setContent] = useState('');
  const [isDraft, setIsDraft] = useState(false);

  const formRef = useRef<
    ProFormInstance<{
      title: string;
      slug?: string;
      bannerUrl?: string;
      description?: string;
      categoryId?: string;
      content?: string;
      displayDate: Date,
      tags: string[]
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
    if (!isEmpty(fileList) && !isEmpty(fileList?.[0]?.originFileObj)) {
      const formData = new FormData();
      formData.append('files', fileList?.[0]?.originFileObj as File);
      formData.append('prefixPath', 'media');
      formData.append('ThumbSizes', '300');
      const res = await uploadFile(formData);
      const { result } = res
      if (result?.paths) {
        values.bannerUrl = result?.paths?.[0];
        values.content = content;
        values.isDraft = isDraft;
        if (values.displayDate) {
          values.displayDate = new Date(values.displayDate).toISOString();
        }
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
      values.isDraft = isDraft;
      if (values.displayDate) {
        values.displayDate = new Date(values.displayDate).toISOString();
      }
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
              submitButtonProps: {},
              render: (props) => {
                console.log(props);
                return [
                  <Button
                    key="draft"
                    onClick={() => {
                      setIsDraft(true);
                      props.form?.submit?.()
                    }}
                  >
                    Lưu nháp
                  </Button>,
                  <Button
                    type="primary"
                    key="publish"
                    onClick={() => {
                      setIsDraft(false);
                      props.form?.submit?.()
                    }}
                  >
                    <GlobalOutlined /> Phát hành
                  </Button>,
                ];
              },
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
            <Row>
              <Col lg={{ span: 16 }}>
                <ProFormText
                  fieldProps={{
                    onChange: (e) => {
                      formRef.current?.setFieldValue('slug', slugify(e.target.value))
                    }
                  }}
                  required
                  name="title"
                  label="Tiêu đề"
                  placeholder="Nhập tiêu đề"
                  rules={[{ required: true, message: 'Xin nhập tiêu đề' }]}
                />
                <ProFormText
                  required
                  name="slug"
                  label="Đường dẫn"
                  placeholder="Nhập đường dẫn (vd: cach-de-day-hoc-hieu-qua)"
                  rules={[{ required: true, message: 'Xin nhập đường dẫn' }]}
                />
                <ProFormText
                  name="description"
                  label="Mô tả ngắn"
                  placeholder="Nhập mô tả"
                />
                <ReactQuill
                  theme="snow"
                  style={{ height: "500px", marginBottom: "75px" }}
                  value={content}
                  onChange={setContent} />
              </Col>
              <Col lg={{ span: 7, offset: 1 }}>
                <ProFormSelect
                  required
                  name="categoryId"
                  // @ts-ignore
                  request={async () => {
                    const { result, success } = await getListCategories({});
                    if (success) {
                      // @ts-ignore
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
                  rules={[{ required: true, message: 'Xin chọn danh mục' }]}
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
                <ProFormDateTimePicker
                  name="displayDate"
                  label="Ngày hiển thị"
                />
                <ProFormSelect
                  mode='tags'
                  name="tags"
                  label="Thẻ"
                  // @ts-ignore
                  request={async () => {
                    const { result, success } = await getListTags({});
                    if (success) {
                      // @ts-ignore
                      return result?.data?.map(s => {
                        return {
                          value: s.key,
                          label: s.key
                        }
                      });
                    }
                    return [];
                  }}
                />
              </Col>
            </Row>
          </ProForm>
        </ProCard>
      </Spin>
    </PageContainer>
  );
};

export default PostForm;
