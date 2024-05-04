'use client'
import { Col, Form, Input, Table, Row, Button, Select, message, DatePicker } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import confirm from "antd/es/modal/confirm";
import { IndexDisplay, colorTextDisplay, RenderAction, getItemWithColor, CurrencyDisplay } from "@/src/utils/DisplayHelper";
import { useEffect, useState } from "react";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { DateTimeFormat, formatDate } from "@/src/utils/DateFormatter";
import dayjs from 'dayjs'
import BillDetailModal from "./DetailModal";

const data = [
  {
    _id: "661605fde75c6959d6722f4d",
    date: "2023-07-24T05:00:00.000Z",
    user: {
      _id: "123",
      name: "Name 1",
      email: "name1@gmail.com",
      phone: "0987654321"
    },
    eventName: "abc",
    tickets: [
      {
        ticketId: "6610115e564e1ea3027d44c9",
        amount: 2,
        price: 100000,
        _id: "661605fde75c6959d6722f4e"
      },
      {
        ticketId: "66101193564e1ea3027d44cc",
        amount: 1,
        price: 700000,
        _id: "661605fde75c6959d6722f4f"
      }
    ],
    totalPrice: 900000,
    discount: 20,
    checkoutMethod: "VNPAY",
    status: 2,

  },
  {
    _id: "6616460a2523f802082f6b94",
    date: "2023-07-24T05:00:00.000Z",
    user: {
      _id: "123",
      name: "Name 1",
      email: "name1@gmail.com",
      phone: "0987654321"
    },
    eventName: "adc",
    tickets: [
      {
        ticketId: "6610115e564e1ea3027d44c9",
        amount: 2,
        price: 100000,
        _id: "6616460a2523f802082f6b95"
      },
      {
        ticketId: "66101193564e1ea3027d44cc",
        amount: 1,
        price: 700000,
        _id: "6616460a2523f802082f6b96"
      }
    ],
    totalPrice: 900000,
    discount: 20,
    checkoutMethod: "VNPAY",
    status: 0,

  },
  {
    _id: "66164920aab185e844512a2c",
    date: "2023-07-24T05:00:00.000Z",
    user: {
      _id: "123",
      name: "Name 1",
      email: "name1@gmail.com",
      phone: "0987654321"
    },
    eventName: "bga",
    tickets: [
      {
        ticketId: "6610115e564e1ea3027d44c9",
        amount: 2,
        price: 100000,
        _id: "66164920aab185e844512a2d"
      },
      {
        ticketId: "66101193564e1ea3027d44cc",
        amount: 1,
        price: 700000,
        _id: "66164920aab185e844512a2e"
      }
    ],
    totalPrice: 900000,
    discount: 20,
    checkoutMethod: "VNPAY",
    status: 0,

  },
  {
    _id: "66192490e2ff3ec908a717a1",
    date: "2023-07-24T05:00:00.000Z",
    user: {
      _id: "123",
      name: "Name 1",
      email: "name1@gmail.com",
      phone: "0987654321"
    },
    eventName: "ưeas",
    tickets: [
      {
        ticketId: "661011f6564e1ea3027d44cf",
        amount: 2,
        price: 100000,
        _id: "66192490e2ff3ec908a717a2"
      },
      {
        ticketId: "66101246564e1ea3027d44d2",
        amount: 1,
        price: 150000000,
        _id: "66192490e2ff3ec908a717a3"
      }
    ],
    totalPrice: 150200000,
    discount: 5,
    checkoutMethod: "VNPAY",
    status: 1,

  },
  {
    _id: "66192542e2ff3ec908a717aa",
    date: "2023-07-24T05:00:00.000Z",
    user: {
      _id: "123",
      name: "Name 1",
      email: "name1@gmail.com",
      phone: "0987654321"
    },
    eventName: "hsd",
    tickets: [
      {
        ticketId: "661011f6564e1ea3027d44cf",
        amount: 2,
        price: 100000,
        _id: "66192542e2ff3ec908a717ab"
      },
      {
        ticketId: "66101246564e1ea3027d44d2",
        amount: 1,
        price: 150000000,
        _id: "66192543e2ff3ec908a717ac"
      }
    ],
    totalPrice: 150200000,
    discount: 10,
    checkoutMethod: "VNPAY",
    status: 1,

  },
  {
    _id: "661c00a086b4358a712a6010",
    date: "2023-07-24T05:00:00.000Z",
    user: {
      _id: "123",
      name: "Name 1",
      email: "name1@gmail.com",
      phone: "0987654321"
    },
    eventName: "ggg",
    tickets: [
      {
        ticketId: "66155335a1e9c59b23635fa0",
        amount: 1,
        price: 25000,
        _id: "661c00a086b4358a712a6011"
      },
      {
        ticketId: "661553b3a1e9c59b23635fa9",
        amount: 1,
        price: 50000,
        _id: "661c00a086b4358a712a6012"
      }
    ],
    totalPrice: 75000,
    discount: 0,
    checkoutMethod: "Thanh toán với momo",
    status: 1,

  },
  {
    _id: "661bed63c9bddc0d580b8782",
    date: "2024-04-15T05:00:00.000Z",
    user: {
      _id: "123",
      name: "Name 1",
      email: "name1@gmail.com",
      phone: "0987654321"
    },
    eventName: "áefa",
    tickets: [
      {
        ticketId: "66155335a1e9c59b23635fa0",
        amount: 1,
        price: 25000,
        _id: "661bed63c9bddc0d580b8783"
      },
      {
        ticketId: "661553b3a1e9c59b23635fa9",
        amount: 1,
        price: 50000,
        _id: "661bed63c9bddc0d580b8784"
      }
    ],
    totalPrice: 75000,
    discount: 0,
    checkoutMethod: "Thanh toán với momo",
    status: 1,

  }
]

export default function TransactionHistory() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [transactionList, setTransactionList] = useState([]);
  const [eventList, setEventList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});

  const columnsTable = [
    {
      title: "Thời gian",
      dataIndex: 'date',
      key: 'date',
      width: '15%',
      align: 'center',
      render: (record) => formatDate(record, "HH:mm:ss DD-MM-YYYY"),
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "_id",
      key: '_id',
      width: '10%',
      align: 'center',
    },
    {
      title: "Sự kiện",
      dataIndex: 'eventName',
      key: 'eventName',
      width: '20%',
      align: 'center',
    },
    {
      title: "Email khách hàng",
      key: 'email',
      align: 'center',
      width: '18%',
      render: (record) => {
        return <span>{record?.user?.email}</span>
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'center',
      render: (totalPrice, record) => {
        return <span>{CurrencyDisplay(totalPrice - (totalPrice * (record?.discount / 100)))} VNĐ</span>
      }
    },
    {
      title: "Phương thức",
      dataIndex: 'checkoutMethod',
      key: 'checkoutMethod',
      align: 'center',
    },
    {
      title: "Trạng thái",
      dataIndex: 'status',
      key: 'status',
      width: '8%',
      align: 'center',
      render: (status) => {
        const { title, color } = getItemWithColor(statusList, status);
        return colorTextDisplay(title, color);
      }
    },
    {
      title: "Hành động",
      key: 'action',
      align: 'center',
      width: "8%",
      render: (record) => RenderAction(ShowDetail, null, record)
    }
  ];

  const statusList = [
    { label: "Tất cả", value: "", color: "" },
    { label: "Chưa thanh toán", value: 0, color: "red" },
    { label: "Đã thanh toán", value: 1, color: "#ffd300" },
    { label: "Đã Check-in", value: 2, color: "green" }
  ];

  const getEventNameList = async () => {
    try {
      setLoading(true)
      const params = {
        page: 1,
        limit: 100000000,
      }
      const res = await api.get(ApiPath.GET_EVENT_LIST, { params })
      if (res?.data) {
        const eventNameList = res?.data[0]?.data?.map(event => ({ label: event?.name, value: event?._id }));
        setEventList(eventNameList);
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!")
    } finally {
      setLoading(false)
    }
  }

  const getTransactionList = async () => {
    try {
      setLoading(true);
      const { billId, eventId, email, date, status } = form.getFieldValue();
      const params = {
        page: page,
        limit: limit,
        eventId: eventId !== "" ? eventId : undefined,
        billId: billId !== "" ? billId : undefined,
        status: status !== "" ? status : undefined,
        startDate: date ? date[0].format("M/D/YYYY") : dayjs().startOf('month').format("M/D/YYYY"),
        endDate: date ? date[1].format("M/D/YYYY") : dayjs().endOf('month').format("M/D/YYYY"),
        email: email !== "" ? email : undefined
      }
      const res = await api.get(ApiPath.GET_TRANSACTIONS, { params });
      if (!!res?.data) {
        setTransactionList(res?.data[0]?.data);
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

  useEffect(() => {
    getEventNameList();
  }, [])

  useEffect(() => {
    getTransactionList();
  }, [page, limit])

  return (
    <>
      <Form form={form} layout="vertical" className="p-4" onFinish={getTransactionList}>
        <Row gutter={12} className="flex justify-start">
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Form.Item
              name="billId"
              label={<span className="text-white font-bold">Mã hóa đơn</span>}
            >
              <Input placeholder="Nhập mã hóa đơn" allowClear />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Form.Item
              name="eventId"
              label={<span className="text-white font-bold">Tên sự kiện</span>}
            >
              <Select
                showSearch
                placeholder="Nhập tên sự kiện"
                allowClear
                optionLabelProp="label"
                optionFilterProp="children"
                options={eventList}
                filterOption={(input, option) =>
                  option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Form.Item
              name="email"
              label={<span className="text-white font-bold">Email khách hàng</span>}
            >
              <Input placeholder="Nhập tên sự kiện" allowClear />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Form.Item
              name="date"
              label={<span className="text-white font-bold">Khoảng ngày</span>}
            >
              <DatePicker.RangePicker
                className="w-full"
                defaultValue={[dayjs().startOf('month'), dayjs().endOf('month')]}
                format="DD/MM/YYYY"
                allowClear={false}
              />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 10 }} xl={{ span: 8 }} xxl={{ span: 8 }}>
            <Form.Item
              name="status"
              label={<span className="text-white font-bold">Trạng thái</span>}
            >
              <Select options={statusList} defaultValue={""} />
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
        LỊCH SỬ GIAO DỊCH
      </h1>
      <h2 className="font-bold text-md text-white mb-2 ml-4">
        Tổng bản ghi: {total}
      </h2>
      <div className="h-[55vh] overflow-auto w-full px-4 rounded-xl">
        <Table
          className="h-20 pb-2"
          bordered
          size="middle"
          columns={columnsTable}
          dataSource={transactionList}
          scroll={{ x: 1200 }}
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
      <BillDetailModal
        record={selectedRecord}
        showModal={showModal}
        setShowModal={setShowModal}
        statusList={statusList.filter((item) => item.value !== "")}
      />
    </>
  )
}