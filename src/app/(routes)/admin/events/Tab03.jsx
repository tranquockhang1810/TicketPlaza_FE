import { useState, useEffect } from "react";
import { Form, List, Avatar, Skeleton, Input, Select, Button, Modal, Empty, message } from "antd";
import confirm from "antd/es/modal/confirm";
import { UserOutlined } from '@ant-design/icons';
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { useUser } from "@/src/context/UserContext";

const color = '#6E1010';

export default function Tab03({
  record,
  showModal,
  getEvents,
}) {
  const { user } = useUser();
  const [form] = Form.useForm();
  const [initMembersIDs, setInitMembersIDs] = useState([ record?.host, ...record?.members]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [adminList, setAdminList] = useState([]);
  const [memberList, setMemberList] = useState([]);

  const GetAdminList = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 100,
        status: 0,
        justAdmin: true
      }
      const res = await api.get(ApiPath.GET_USER_INFO, { params });
      if(res?.data){
        const data = res.data[0].data
        setAdminList(data);
        const memList = data.filter(user => initMembersIDs.includes(user._id));
        setMemberList(memList);
        setTotal(memList.length);
      } else {
        message.error( res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleChangePage = (newPage, newPageSize) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  const handleAddMembers = async () => {
    try {
      setLoading(true);
      const memList = form.getFieldValue("members") ? form.getFieldValue("members") : [];
      if (memList.length === 0) {
        message.error("Chưa chọn thành viên để thêm!");
        return;
      } 
      const params = { eventId: record?._id };
      const body = { 
        members: [
          ...memList, 
          ...initMembersIDs
        ] 
      }
      const res = await api.patch(ApiPath.UPDATE_EVENT, body, { params });
      if(res?.data) {  
        message.success(res?.message);
        setInitMembersIDs(body.members)
        const memList = adminList.filter(user => body.members.includes(user._id));
        setMemberList(memList);
        setTotal(memList.length);
        form.resetFields();
        await getEvents();
      } else {
        message.error( res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteMember = (userId) => {
    if(user?._id !== record?.host) {
      message.error("Bạn không thể xóa thành viên vì không phải Host!");
      return;
    }
    return (
      confirm({
        title: "Bạn có muốn xóa thành viên này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: async () => {
          try {
            setLoading(true);
            const params = { eventId: record?._id };
            const body = { 
              members: initMembersIDs.filter(id => id !== userId)
            }
            const res = await api.patch(ApiPath.UPDATE_EVENT, body, { params });
            if(res?.data) {  
              message.success(res?.message);
              setInitMembersIDs(body.members)
              const memList = adminList.filter(user => body.members.includes(user._id));
              setMemberList(memList);
              setTotal(memList.length);
              form.resetFields();
              await getEvents();
            } else {
              message.error( res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
            }
          } catch (error) {
            message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
            console.error(error);
          } finally {
            setLoading(false)
          }
        }
      })
    );
  };

  useEffect(() => {
    GetAdminList();
  }, [showModal])

  return (
    <div>
      <div className="text-center mb-2">
        <span className="font-bold">
          VAI TRÒ CỦA BẠN: {(user?._id === record?.host || memberList.includes(user?._id)) 
          ? `THÀNH VIÊN ${user?._id === record?.host && ' - HOST'}` 
          : 'KHÔNG PHẢI THÀNH VIÊN'}
        </span>
      </div>
      {user?._id === record?.host && (
        <Form
          layout="horizontal"
          form={form}
          onFinish={handleAddMembers}
        >
          <Form.Item name="members" >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Chọn tên Admin"
              mode="multiple"
              allowClear
              optionLabelProp="label"
              maxTagCount={2} 
              maxTagTextLength={15}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {adminList.map(user => {
                if (memberList.some(member => member._id === user._id)) {
                  return null;
                }
                return (
                  <Select.Option key={user._id} value={user._id} label={user.fullName}>
                    <div className="flex items-center">
                      <Avatar
                        style={{
                          marginRight: "8px",
                          backgroundColor: color,
                          verticalAlign: 'middle',
                        }}
                        icon={<UserOutlined />}
                        size="small"
                      />
                      <div>
                        <div className="font-bold">{user.fullName}</div>
                        <div className="text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          {user?._id === record?.host && (
            <Form.Item>
              <Button
                className="nav-button w-full"
                htmlType="submit"
              > 
                Thêm thành viên
              </Button>
            </Form.Item>
          )}
          
        </Form>
      )}
      <div>
        Tổng số thành viên: {total}
      </div>
      <div className="max-h-[68vh] overflow-y-auto">
        <List
          loading={loading}
          itemLayout="horizontal"
          dataSource={memberList}
          pagination={{
            pageSize: limit,
            current: page,
            total,
            showSizeChanger: true,
            onChange: handleChangePage,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <span 
                  className="text-red-800 font-bold hover:cursor-pointer hover:underline"
                  key="delete"
                  onClick={() => {
                    handleDeleteMember(item._id);
                  }}
                >
                  Xóa
                </span>
              ]}
            >
              <Skeleton avatar loading={loading} title={false} active>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      style={{
                        backgroundColor: color,
                        verticalAlign: 'middle',
                      }}
                      icon={<UserOutlined />}
                    />
                  }
                  title={
                    <span
                      className={item?._id === record?.host && "font-bold text-red-900"}
                    >
                        {item?.fullName}
                    </span>
                  }
                  description={item?.email}
                />
              </Skeleton>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
