import services from '@/services';
import {
  ActionType,
  ProDescriptionsItemProps,
  ProTable,
  PageContainer,
} from '@ant-design/pro-components';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { ClockCircleOutlined, PlusCircleFilled, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
// @ts-ignore
import { history } from '@umijs/max';
// @ts-ignore
import { Link } from 'umi';

const { getListCategories, deleteCategory } = services.CategoryController;

const Category: React.FC<unknown> = () => {
  useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const columns: ProDescriptionsItemProps<API.GetListCategoriesResponse>[] = [
    {
      title: 'STT',
      valueType: 'text',
      hideInSearch: true,
      render: (_, record, index) => (
        <>
          {index +
            1 +
            ((actionRef.current?.pageInfo?.current ?? 0) - 1) *
            (actionRef.current?.pageInfo?.pageSize ?? 0)}
        </>
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      valueType: 'text',
      render: (_, record) => (
        <Link to={"/cms/categories/edit/" + record.id}>{record.name}</Link>
      )
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      valueType: 'text',
      hideInSearch: true
    },
    {
      title: () => <div><ClockCircleOutlined /> Ngày tạo</div>,
      dataIndex: 'createdDate',
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => (
        <>{moment(record.createdDate).format('DD/MM/YYYY H:mm:ss')}</>
      ),
    },
    {
      title: () => <div><ClockCircleOutlined /> Ngày chỉnh sửa</div>,
      dataIndex: 'modifiedDate',
      valueType: 'date',
      hideInSearch: true,
      render: (_, record) => (
        <>{moment(record.modifiedDate).format('DD/MM/YYYY H:mm:ss')}</>
      ),
    },
    {
      title: () => <div>Hành động</div>,
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Button type="primary" style={{ marginRight: "10px" }} onClick={() => { history.push("/cms/categories/edit/" + record.id) }}><EditOutlined /> Chỉnh sửa</Button>
          <Button type="primary" danger onClick={async () => {
            const { success } = await deleteCategory({ id: record.id });
            if (success) {
              message.success('Thành công');
              actionRef.current?.reload();
            }
            else {
              message.error('Không thành công');
            }
          }}><DeleteOutlined /> Xoá</Button>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Danh mục',
      }}
    >
      <ProTable<API.GetListCategoriesResponse>
        headerTitle="Danh sách danh mục"
        actionRef={actionRef}
        rowKey="id"
        scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => {
              history.push("/cms/categories/create");
            }}
          >
            <PlusCircleFilled></PlusCircleFilled> Tạo mới
          </Button>,
        ]}
        request={async (params) => {
          // @ts-ignore
          const { result, success } = await getListCategories({
            ...params,
            filterOptions: {
              pageSize: params.pageSize,
              pageIndex: params.current,
              sorter: {
                order: "asc"
              }
            },
          });

          return {
            data: result?.data || [],
            success,
            total: result?.totalRecords
          };
        }}
        // @ts-ignore
        columns={columns}
      />
    </PageContainer>
  );
};

export default Category;
