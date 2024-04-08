'use client'
import { Col, Form, Input, Table, Row, Button, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import confirm from "antd/es/modal/confirm";
import { IndexDisplay, colorTextDisplay, RenderAction, getItemWithColor } from "@/src/utils/DisplayHelper";
import { useEffect, useState } from "react";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import EventTypeDetailModal from "./DetailModal";
import AddNewModal from "./AddNewModal";

export default function EventType() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [eventTypeList, SetEventTypeList] = useState([]);

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
      title: "Tên thể loại",
      dataIndex: "eventTypeName",
      key: 'eventTypeName',
      align: 'center',
    },
    {
      title: "Mã thể loại",
      dataIndex: 'typeId',
      key: 'typeId',
      width: '20%',
      align: 'center',
    },
    {
      title: "Trạng thái",
      dataIndex: 'status',
      key: 'status',
      width: '10%',
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
      width: "10%",
      render: (record) => RenderAction(ShowDetail, DeleteItem, record)
    }
  ];

  const statusList = [
    { label: "Tất cả", value: "", color: ""},
    { label: "Kích hoạt", value: 0, color: "green"},
    { label: "Khóa", value: 1, color: "red"}
  ];

  const getTypeList = async () => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        status: form.getFieldValue("status") === "" ? undefined : form.getFieldValue("status"),
        typeId: form.getFieldValue("typeId") === "" ? undefined : form.getFieldValue("typeId"),
        eventTypeName: form.getFieldValue("eventTypeName") === "" ? undefined : form.getFieldValue("eventTypeName"),
      }
      const res = await api.get(ApiPath.GET_EVENT_TYPE_LIST, { params });
      if (!!res?.data) {
        SetEventTypeList(res?.data[0].data);
        setTotal(res?.pagination?.totalItems || 0);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }

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
      message.info("Thể loại này đã bị khóa!");
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
            const params = { eventTypeId: record?._id}; 
            const body = {};
            const res = await api.patch(ApiPath.DEACTIVATE_EVENT_TYPE, body, { params });
            if(!!res?.data) {
              await getTypeList();
              message.success(res?.message );
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
    getTypeList();
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
          Thêm thể loại mới 
        </Button>
      </div>
      <Form form={form} layout="vertical" className="p-4" onFinish={getTypeList}>
        <Row gutter={12} className="flex justify-between">
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
            <Form.Item
              name="eventTypeName"
              label={<span className="text-white font-bold">Tên thể loại</span>}
            >
              <Input placeholder="Nhập tên thể loại" allowClear/>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 8 }} xxl={{ span: 6 }}>
            <Form.Item
              name="typeId"
              label={<span className="text-white font-bold">Mã thể loại</span>}
            >
              <Input placeholder="Nhập mã thể loại" allowClear/>
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
        LOẠI SỰ KIỆN
      </h1>
      <h2 className="font-bold text-md text-white mb-2 ml-4">
        Tổng bản ghi: {total}
      </h2>
      <div className="h-[60vh] overflow-auto w-full px-4 rounded-xl">
        <Table
          className="h-20 pb-2"
          bordered
          size="middle"
          columns={columnsTable}
          dataSource={eventTypeList}
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
      <EventTypeDetailModal
        record={selectedRecord}
        setShowModal={setShowModal}
        showModal={showModal}
        getTypeList={getTypeList}
        DeactivateType={DeleteItem}
        statusList={statusList}
      />
      <AddNewModal
        getTypeList={getTypeList}
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        statusList={statusList.filter(item => item.value !== "")}
      />
    </>
  )
}