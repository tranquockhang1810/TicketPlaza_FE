import { useTicket } from "@/src/context/BuyTicketsContext";
import { useUser } from "@/src/context/UserContext";
import { Empty, Button, Form, Table, Input, Space, message, Segmented, Avatar, Row, Divider } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { IndexDisplay, CurrencyDisplay } from "@/src/utils/DisplayHelper";
import { useState } from "react";
import dayjs from 'dayjs';
import { dateWithUct } from "@/src/utils/DateFormatter";
import ApiPath from "@/src/app/api/apiPath";
import api from "@/src/app/api/api";
import { convertBillToEmailHtml } from "@/src/utils/EmailHTML";


export default function BillCheck({ current, setCurrent }) {
  const { tickets, event } = useTicket();
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState("MOMO");
  const router = useRouter();
  const { user } = useUser();
  const [form] = Form.useForm();
  const totalPrice = tickets.reduce((acc, cur) => acc + cur.price * cur.amount, 0);
  const tableHeader = [
    {
      title: "STT",
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      align: 'center',
      render: (item, record, index) => IndexDisplay(1, 10, index, item, record),
    },
    {
      title: "Vé",
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: "Giá",
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price) => <span>{CurrencyDisplay(price)} VNĐ</span>
    },
    {
      title: "SL",
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    },
    {
      title: "Thành tiền",
      key: "totalMoneyOfTicket",
      align: "center",
      render: (record) => (
        <span>{CurrencyDisplay(record.price * record.amount)} VNĐ</span>
      )
    }
  ]

  const handleApplyDiscount = () => {
    const value = form.getFieldValue("discountInput");
    const regex = /^TP_(5[0]|[1-4][0-9]|[1-9][0-9]|10)$/;

    if (regex.test(value)) {
      const discountAmount = parseInt(value.split("_")[1]);
      setDiscount(discountAmount);
    } else {
      message.error("Mã giảm giá không hợp lệ!");
      setDiscount(0);
    }
  };

  const handleMomoPay = async () => {
    try {
      setLoading(true);
      const body = {
        date: dateWithUct(dayjs()),
        userId: user?._id,
        eventId: event?.eventID,
        tickets: tickets.map(({ name, ...rest }) => rest),
        totalPrice,
        discount,
        checkoutMethod: method,
        status: 0
      }
      const res = await api.post(ApiPath.CREATE_BILL, body);
      if (res?.data[0]) {
        const params = {
          billId: res?.data[0]?.data?._id
        }
        const newBill = await api.get(ApiPath.GET_BILL_DETAIL, {params});
        console.log(newBill);
        const momoBody = {
          billId: res?.data[0]?.data?._id,
          orderInfo: res?.data[0]?.data?.checkoutMethod,
          amount: res?.data[0]?.theAmountPaid,
          subject: `VÉ THAM DỰ SỰ KIỆN "${event?.name}"`,
          //text: convertBillToEmailHtml(newBill?.data[0]?.data),
        }
        console.log(momoBody);
        const momoRes = await api.post(ApiPath.MOMO_PAID, momoBody);
        router.push(momoRes?.payUrl);
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-4/5 primary-bg rounded-xl p-4 m-4">
      {tickets.length > 0 ? (
        <Form layout="horizontal" form={form} className="mt-4">
          <Row className="w-full flex justify-between">
            <div className="text-white w-full text-xl font-bold mb-4 text-left">
              SỰ KIỆN
            </div>
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">- Sự kiện: </span>}
              className="mr-4"
            >
              <div className="text-left text-white">
                <span>{event?.name}</span>
              </div>
            </Form.Item>
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">- Thời gian diễn ra: </span>}
              className="mr-4"
            >
              <div className="text-left text-white">
                <span>{event?.date}</span>
              </div>
            </Form.Item>
          </Row>
          <Row className="w-full flex justify-between">
            <div className="text-white w-full text-xl font-bold mb-4 text-left">
              KHÁCH HÀNG
            </div>
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">- Họ tên khách hàng: </span>}
              className="mr-4"
            >
              <div className="text-left text-white">
                <span>{user?.fullName}</span>
              </div>
            </Form.Item>
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">- Email: </span>}
              className="mr-4"
            >
              <div className="text-left text-white">
                <span>{user?.email}</span>
              </div>
            </Form.Item>
          </Row>
          <Row>
            <div className="text-white w-full text-xl font-bold mb-4 text-left">
              CHI TIẾT VÉ
            </div>
            <Table
              columns={tableHeader}
              dataSource={tickets}
              pagination={false}
              className="mb-4 w-full"
              size="small"
            />
          </Row>
          <Row className="w-full flex justify-center">
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">Mã giảm giá: </span>}
              name="discountInput"
              className="md:w-3/4 w-full"
            >
              <Space.Compact
                className="w-full"
              >
                <Input
                  placeholder="Nhập mã giảm giá (TP_{10-90})"
                />
                <Button className="main-button" onClick={handleApplyDiscount}>Áp dụng</Button>
              </Space.Compact>
            </Form.Item>
          </Row>
          <Row className="w-full flex justify-center">
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">Tổng tiền vé: </span>}
              className="md:w-3/4 w-full"
            >
              <div className="text-right text-white">
                <span>{CurrencyDisplay(totalPrice)} VNĐ</span>
              </div>
            </Form.Item>
          </Row>
          <Row className="w-full flex justify-center">
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">Giảm giá {discount ? `(${discount}%)` : ""}: </span>}
              className="md:w-3/4 w-full"
            >
              <div className="text-right text-white">
                <span>{CurrencyDisplay((totalPrice * (discount / 100)))} VNĐ</span>
              </div>
            </Form.Item>
          </Row>
          <Row className="w-full flex justify-center">
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">Thành tiền: </span>}
              className="md:w-3/4 w-full"
            >
              <div className="text-right text-white">
                <span>{CurrencyDisplay(totalPrice - (totalPrice * (discount / 100)))} VNĐ</span>
              </div>
            </Form.Item>
          </Row>
          <Row className="w-full flex justify-center">
            <Form.Item
              colon={false}
              label={<span className="font-bold text-white">Phương thức thanh toán: </span>}
              name="method"
              initialValue={"MOMO"}
              className="md:w-3/4 w-full"
            >
              <div className="text-right">
                <Avatar src="https://developers.momo.vn/v3/assets/images/square-logo-f8712a4d5be38f389e6bc94c70a33bf4.png" shape="square" />
              </div>
            </Form.Item>
          </Row>
          <div className="w-full flex justify-between">
            <Button
              className="nav-button h-8"
              icon={<ArrowLeftOutlined />}
              onClick={() => router.back()}
            >
              Chỉnh sửa vé
            </Button>
            <Button
              loading={loading}
              className="main-button h-8"
              onClick={handleMomoPay}
            >
              Thanh toán
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <Empty description={<span className="text-white">Chưa có thông tin vé!</span>} />
          <Button
            className="nav-button h-8"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
          >
            Quay về
          </Button>
        </>
      )}
    </div>
  )
}