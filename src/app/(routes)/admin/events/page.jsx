'use client'
import { Col, Form, Input, Table, Row, Button, Select, message, DatePicker } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import confirm from "antd/es/modal/confirm";
import { IndexDisplay, colorTextDisplay, RenderAction, getItemWithColor, getLabelByValue } from "@/src/utils/DisplayHelper";
import { useEffect, useState } from "react";
import { useUser } from "@/src/context/UserContext";
import { useRouter, usePathname } from "next/navigation";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import dayjs from 'dayjs';
import { formatRangeDate, isCheckinDate } from "@/src/utils/DateFormatter";
import EventModal from "./DetailModal";
import CreateModal from "./CreateModal";

export default function Events() {
  const [form] = Form.useForm();
  const router = useRouter();
  const path = usePathname();
  const { isSuperAdmin, user } = useUser();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [eventTypeList, SetEventTypeList] = useState([]);
  const [eventList, setEventList] = useState([]);

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
      title: "Tên sự kiện",
      dataIndex: "name",
      key: 'name',
      align: 'left',
    },
    {
      title: "Thể loại",
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (value) => {
        return getLabelByValue(eventTypeList, value);
      }
    },
    {
      title: "Trạng thái",
      dataIndex: 'status',
      key: 'status',
      width: '10%',
      align: 'center',
      render: (status, record) => {
        const { title, color } = getItemWithColor(statusList, status, record);
        return colorTextDisplay(title, color);
      }
    },
    {
      title: "Thời gian",
      dataIndex: 'date',
      key: 'date',
      align: 'left',
      render: (item, record) => {
        return formatRangeDate(item, record)
      }
    },
    {
      title: "Hành động",
      key: 'action',
      align: 'center',
      width: "10%",
      render: (record) => RenderAction(ShowDetail, DeleteItem, record, CheckInBill)
    }
  ];

  const statusList = [
    { label: "Tất cả", value: "", color: "" },
    { label: "Chưa diễn ra", value: 0, color: "#ffd300" },
    { label: "Đã khóa", value: 1, color: "red" },
    { label: "Đã hoàn thành", value: 2, color: "green" }
  ];

  const getTypeList = async () => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: 1000,
        status: 0,
      }
      const res = await api.get(ApiPath.GET_EVENT_TYPE_LIST, { params });
      if (!!res?.data) {
        const typeListWithAll = [
          { label: "Tất cả", value: "" },
          ...res?.data[0].data.map(item => ({ label: item.eventTypeName, value: item.typeId }))
        ];
        SetEventTypeList(typeListWithAll);
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const getEvents = async () => {
    try {
      setLoading(true);
      const params = {
        page: page,
        limit: limit,
        host: isSuperAdmin() ? undefined : user?._id,
        member: isSuperAdmin() ? undefined : user?._id,
        status: form.getFieldValue("status") === "" ? undefined : form.getFieldValue("status"),
        type: form.getFieldValue("type") === "" ? undefined : form.getFieldValue("type"),
        name: form.getFieldValue("name") === "" ? undefined : form.getFieldValue("name"),
        startDate: form.getFieldValue("date") ? form.getFieldValue("date")[0].format("M/D/YYYY") : dayjs().startOf('year').format("M/D/YYYY"),
        endDate: form.getFieldValue("date") ? form.getFieldValue("date")[1].format("M/D/YYYY") : dayjs().endOf('year').format("M/D/YYYY"),
      }
      const res = await api.get(ApiPath.GET_EVENT_LIST, { params });
      if (!!res?.data) {
        setEventList(res?.data[0].data);
        setTotal(res?.pagination?.totalItems || 0);
      } else {
        message.error(res?.error?.message);
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
      message.info("Sự kiện này đã bị khóa!");
      return;
    }
    if (record?.status === 2) {
      message.info("Sự kiện này đã hoàn thành. Không thể khóa!");
      return;
    }
    return (
      confirm({
        title: "Bạn có muốn khóa sự kiện này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: async () => {
          try {
            setLoading(true);
            const params = { eventId: record?._id };
            const body = {};
            const res = await api.patch(ApiPath.DEACTIVATE_EVENT, body, { params });
            if (!!res?.data) {
              await getEvents();
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

  const CheckInBill = async (item) => {
    if (!isCheckinDate(item)) {
      message.error("Chưa đến thời gian Check-in!");
      return;
    }
    return (
      confirm({
        title: "Bạn có muốn mở check-in sự kiện này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: () => {
          try {
            router.push(`${path}/check-in?eventId=${item?._id}`)
          } catch (error) {
            console.error(error);
            message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
          }
        }
      })
    );
  }

  useEffect(() => {
    getTypeList();
    getEvents();
  }, [page, limit])

  return (
    <>
      <div className="flex justify-end">
        <Button
          type="primary"
          shape="round"
          className=" mt-4 mr-2 main-button h-8"
          icon={<PlusCircleOutlined />}
          onClick={() => setShowAddModal(true)}
        >
          Thêm sự kiện mới
        </Button>
      </div>
      <Form form={form} layout="vertical" className="p-4"
        onFinish={getEvents}
      >
        <Row gutter={12} className="flex justify-between">
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
            <Form.Item
              name="name"
              label={<span className="text-white font-bold">Tên sự kiện</span>}
            >
              <Input placeholder="Nhập tên sự kiện" allowClear />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
            <Form.Item
              name="type"
              label={<span className="text-white font-bold">Thể loại</span>}
            >
              <Select options={eventTypeList} defaultValue={""} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
            <Form.Item
              name="status"
              label={<span className="text-white font-bold">Trạng thái</span>}
            >
              <Select options={statusList} defaultValue={""} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
            <Form.Item
              name="date"
              label={<span className="text-white font-bold">Khoảng ngày bắt đầu</span>}
            >
              <DatePicker.RangePicker
                className="w-full"
                defaultValue={[dayjs().startOf('year'), dayjs().endOf('year')]}
                format="DD/MM/YYYY"
                allowClear={false}
              />
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
        CÁC SỰ KIỆN
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
          dataSource={eventList}
          scroll={{ x: 1000 }}
          loading={loading}
          pagination={{
            pageSize: limit,
            current: page,
            total,
            showSizeChanger: true,
            onChange: handleChangePage,
            pageSizeOptions: ["10", "20", "50", "100"],
            className: "paging"
          }}
        />
      </div>
      <EventModal
        record={selectedRecord}
        showModal={showModal}
        setShowModal={setShowModal}
        getEvents={getEvents}
        statusList={statusList.filter((item) => item.value !== "")}
        typeList={eventTypeList.filter((item) => item.value !== "")}
      />
      <CreateModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        getEvents={getEvents}
        typeList={eventTypeList.filter((item) => item.value !== "")}
      />
    </>
  )
}