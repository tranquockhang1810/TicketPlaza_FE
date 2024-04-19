import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { Modal, Button, Form, Spin, Input, message, DatePicker, Select, Table } from "antd";
import { useEffect, useState } from "react";
import confirm from "antd/es/modal/confirm";
import { colorTextDisplay, getItemWithColor, IndexDisplay, CurrencyDisplay } from "@/src/utils/DisplayHelper";
import dayjs from 'dayjs'
import { dateWithUct, DateTimeFormat, formatDate } from "@/src/utils/DateFormatter";
import { render } from "react-dom";

export default function BillDetailModal({
  record,
  showModal,
  setShowModal,
  statusList
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState();

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
      dataIndex: "totalMoneyOfTicket",
      key: 'totalMoneyOfTicket',
      align: 'center',
      render: (totalMoneyOfTicket) => <span>{CurrencyDisplay(totalMoneyOfTicket)} VNĐ</span>
    }
  ]

  const getBillDetail = async () => {
    try {
      setLoading(true);
      const params = {
        billId: record?._id
      }
      const res = await api.get(ApiPath.GET_BILL_DETAIL, { params });
      if(res?.data[0].data) {
        setDetail(res?.data[0]?.data);
      } else {
        message.error( res?.error?.message || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  }

  const RenderStatus = (status) => {
    const {title, color} = getItemWithColor(statusList,status);
    return colorTextDisplay(title, color);
  }

  useEffect(() => {
    getBillDetail();
  },[showModal])
  
  return (
    <Spin spinning={loading} >
      <Modal
        maskClosable={false}
        open={showModal}
        centered
        destroyOnClose
        title={<span className="text-xl font-bold">Thông tin chi tiết</span>}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form layout="horizontal" form={form} className="mt-4">
          <Form.Item
            label={<span className="font-bold">Mã hóa đơn</span>}
          >
            <div className="text-right">
              <span>{detail?._id}</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Thời gian tạo</span>}
          >
            <div className="text-right">
              <span>{formatDate(detail?.date, 'HH:mm:ss DD-MM-YYYY')}</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Sự kiện</span>}
          >
            <div className="text-right">
              <span>{detail?.event}</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Họ tên khách hàng</span>}
          >
            <div className="text-right">
              <span>{detail?.user?.fullName}</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Email</span>}
          >
            <div className="text-right">
              <span>{detail?.user?.email}</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Chi tiết vé</span>}
          />
          <Table
            columns={tableHeader}
            dataSource={detail?.tickets}
            pagination={false}
            className="mb-4"
          />
          <Form.Item
            label={<span className="font-bold">Phương thức</span>}
          >
            <div className="text-right">
              <span>{detail?.checkoutMethod}</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Tổng cộng</span>}
          >
            <div className="text-right">
              <span>{CurrencyDisplay(detail?.totalMoney)} VNĐ</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Giảm giá</span>}
          >
            <div className="text-right">
              <span>{detail?.discount} %</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Thành tiền</span>}
          >
            <div className="text-right">
              <span className="font-bold">{CurrencyDisplay(detail?.theMoneyHasToPaid)} VNĐ</span>
            </div>
          </Form.Item>
          <Form.Item
            label={<span className="font-bold">Trạng thái</span>}
          >
            <div className="text-right">
              <span>{RenderStatus(detail?.status)}</span>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Spin>
  )
}