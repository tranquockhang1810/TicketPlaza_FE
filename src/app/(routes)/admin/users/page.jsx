'use client'
import { Col, Form, Input, InputNumber, Table, Row, Button, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import confirm from "antd/es/modal/confirm";
import { IndexDisplay, colorTextDisplay, RenderAction, getItemWithColor } from "@/src/utils/DisplayHelper";
import { useEffect, useState } from "react";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { useUser } from "@/src/context/UserContext";
import UserDetailModal from "./DetailModal";
import AddUserModal from "./AddUserModel";

export default function Users() {
  const [form] = Form.useForm();
  const { user } = useUser();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [userList, setUserList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});

  const columnsTable = [
    {
      title: "STT",
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      align: 'center',
      render: (item, record, index) => IndexDisplay(page, limit, index, item, record),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: 'fullName',
      align: 'center',
    },
    {
      title: "Email",
      dataIndex: "email",
      key: 'email',
      align: 'center',
    },
    {
      title: "Số điện thoại",
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: "Loại tài khoản",
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (status) => {
        const {title, color} = getItemWithColor(typeList,status);
        return colorTextDisplay(title, color);
      }
    },
    {
      title: "Trạng thái",
      dataIndex: 'status',
      key: 'status',
      //width: '10%',
      align: 'center',
      render: (status) => {
        const {title, color} = getItemWithColor(statusList,status);
        return colorTextDisplay(title, color);
      }
    },
    {
      title: "Hành động",
      key: 'action',
      align: 'center',
      //width: "10%",
      render: (record) => RenderAction(ShowDetail, DeleteItem, record)
    }
  ];

  const statusList = [
    { label: "Tất cả", value: "", color: ""},
    { label: "Kích hoạt", value: 0, color: "green"},
    { label: "Khóa", value: 1, color: "red"}
  ];

  const typeList = [
    { label: "Tất cả", value: "", color: ""},
    { label: "Admin", value: 1, color: ""},
    { label: "Super Admin", value: 2, color: "#ffd300"}
  ];

  const getUserList = async () => {
    try {
      setLoading(true);
      const { fullName, email, phone, type, status} = form.getFieldValue();
      const params = {
        page: page,
        limit: limit,
        fullName: fullName !== "" ? fullName : undefined,
        email: email !== "" ? email : undefined,
        phone: phone !== "" ? phone : undefined,
        type: type !== "" ? type : undefined,
        status: status !== "" ? status : undefined,
        justAdmin: type === "" || type === undefined ? true : undefined,
      }
      const res = await api.get(ApiPath.GET_USER_INFO, { params });
      if (!!res?.data) {
        setUserList(res?.data[0].data);
        setTotal(res?.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = (e) => {
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const handleChangePage = (newPage, newPageSize) => {
    setPage(newPage);
    setLimit(newPageSize);
  };

  const ShowDetail = (record) => {
    setSelectedRecord(record)
    setShowModal(true);
  };

  const DeleteItem = (record) => {
    if (record?.status === 1) {
      message.info("Tài khoản này đã bị khóa!");
      return;
    }
    if (record?._id === user._id) {
      message.info("Không thể tự khóa tài khoản của bạn!");
      return;
    }
    return (
      confirm({
        title: "Bạn có muốn khóa thể loại này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: async () => {
          try {
            setLoading(true);
            const params = { userId: record?._id}; 
            const body = {};
            const res = await api.patch(ApiPath.DEACTIVATE_USER, body, { params });
            if(!!res?.data) {
              await getUserList();
              message.success(res?.message);
            } else {
              message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
            }
          } catch (error) {
            console.error(error);
            message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
          } finally {
            setLoading(false);
          }
        }
      })
    );
  };

  useEffect(() => {
    getUserList();
  },[page, limit])

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="primary"
          shape="round"
          className=" mt-4 mr-2 main-button h-8"
          icon={<PlusCircleOutlined/>}
          onClick={() => setShowAddModal(true)}
        >
          Thêm tài khoản mới 
        </Button>
      </div>
      <Form form={form} layout="vertical" className="p-4" onFinish={getUserList}>
        <Row gutter={12} className="flex justify-start">
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
            <Form.Item
              name="fullName"
              label={<span className="text-white font-bold">Tên tài khoản</span>}
            >
              <Input placeholder="Nhập tên tài khoản" allowClear/>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
            <Form.Item
              name="email"
              label={<span className="text-white font-bold">Email</span>}
            >
              <Input placeholder="Nhập email" allowClear/>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
            <Form.Item
              label={<span className="text-white font-bold">Số điện thoại</span>}
              name="phone"
            >
              <Input 
                className='w-full' 
                maxLength={10} 
                placeholder='Nhập số điện thoại' 
                onKeyDown={handleKeyPress}
              />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
            <Form.Item
              label={<span className="text-white font-bold">Loại tài khoản</span>}
              name="type"
            >
              <Select options={typeList} defaultValue={""}/>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
            <Form.Item
              name="status"
              label={<span className="text-white font-bold">Trạng thái</span>}
            >
              <Select options={statusList} defaultValue={""}/>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={12}>
          <Button 
            htmlType={'submit'} 
            loading={loading}
            className="main-button h-8 w-full mx-2"
          >
            Tra cứu
          </Button>
        </Row>
      </Form>
      <h1 className="font-bold text-2xl text-white text-center ">
        TÀI KHOẢN ADMIN
      </h1>
      <h2 className="font-bold text-md text-white mb-2 ml-4">
        Tổng bản ghi: {total}
      </h2>
      <div className="h-[48vh] overflow-auto w-full px-4 rounded-xl">
        <Table
          className="h-20 pb-2"
          bordered
          size="middle"
          columns={columnsTable}
          dataSource={userList}
          scroll={{x: 1000}}
          loading={loading}
          pagination={{
            pageSize: limit,
            current: page,
            total,
            showSizeChanger: true,
            onChange: handleChangePage,
            pageSizeOptions: ["10", "20", "50", "100"],
            className:"paging"
          }}
        />
      </div>
      <UserDetailModal
        record={selectedRecord}
        showModal={showModal}
        setShowModal={setShowModal}
        statusList={statusList.filter(item => item.value !== "")}
        typeList={typeList.filter(item => item.value !== "")}
        getUserList={getUserList}
      />
      <AddUserModal
        getUserList={getUserList}
        setShowModal={setShowAddModal}
        showModal={showAddModal}
        typeList={typeList.filter(item => item.value !== "")}
      />
    </>
  )
}