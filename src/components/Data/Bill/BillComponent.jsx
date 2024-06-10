'use client'
import { Card, ConfigProvider, Button } from 'antd';
import { EditOutlined, CommentOutlined, SettingOutlined } from '@ant-design/icons';
import { isCheckinDate, formatDate } from '@/src/utils/DateFormatter';
import { CurrencyDisplay } from '@/src/utils/DisplayHelper';
import BillDetailModal from '@/src/app/(routes)/admin/transaction-history/DetailModal';
import FeedBack from './FeedBack';
import { useState } from 'react';

export default function BillCard({ bill, getBillList }) {
  const [showDetail, setShowDetail] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const statusList = [
    { label: "Tất cả", value: "", color: "" },
    { label: "Chưa thanh toán", value: 0, color: "red" },
    { label: "Đã thanh toán", value: 1, color: "#ffd300" },
    { label: "Đã Check-in", value: 2, color: "green" }
  ];

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Card: {
              colorBgContainer: "#6E1010",
              actionsBg: "#6E1010"
            },
          }
        }}
      >
        <Card
          bordered={false}
          className='m-4 w-[600px]'
          actions={bill?.feetbackStatus === 0 && bill?.status === 2 ? [
            <Button key={"feedback"} className='nav-button w-11/12' onClick={() => setShowFeedback(true)} icon={<CommentOutlined />}>Bình luận</Button>,
            <Button key={"detail"} className='nav-button w-11/12' onClick={() => setShowDetail(true)} icon={<EditOutlined />}>Chi tiết</Button>,
          ] : [
            <Button key={"detail"} className='nav-button w-11/12' onClick={() => setShowDetail(true)} icon={<EditOutlined />}>Chi tiết</Button>,
          ]}
        >
          <div className='h-fit text-white'>
            <div className='h-[40px] text-left font-bold mb-4 text-xl'>
              {bill?.eventName}
            </div>
            <div className='flex justify-between mb-4'>
              <div>
                Thời gian thanh toán:
              </div>
              <div>
                {formatDate(bill?.date, "DD/MM/YYYY HH:mm:ss")}
              </div>
            </div>
            <div className='flex justify-between mb-4'>
              <div>
                Tổng hóa đơn:
              </div>
              <div>
                {CurrencyDisplay(bill?.totalPrice - (bill?.totalPrice * (bill?.discount / 100)))} VNĐ
              </div>
            </div>
            <div className='flex justify-between mb-4'>
              <div>
                Phương thức:
              </div>
              <div>
                {bill?.checkoutMethod}
              </div>
            </div>

          </div>
        </Card>
      </ConfigProvider>
      <BillDetailModal
        record={bill}
        statusList={statusList}
        setShowModal={setShowDetail}
        showModal={showDetail}
        client={true}
      />
      <FeedBack
        showModal={showFeedback}
        setShowModal={setShowFeedback}
        bill={bill}
        getBillList={getBillList}
      />
    </>
  )
}