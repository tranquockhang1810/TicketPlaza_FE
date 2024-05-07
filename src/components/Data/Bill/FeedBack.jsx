import { Form, Modal, Rate, Input, Button, message } from 'antd';
import { StarFilled } from '@ant-design/icons'
import { useState, useEffect } from 'react';
import api from '@/src/app/api/api';
import ApiPath from '@/src/app/api/apiPath';
import { useRouter } from 'next/navigation';

export default function FeedBack({
  showModal,
  setShowModal,
  bill,
  getBillList
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const SendFeedback = () => {
    try {
      setLoading(true)
      form.validateFields().then(async () => {
        const { rate, context } = form.getFieldValue();
        const body = {
          rate,
          context,
          billId: bill?._id,
          status: 0
        }
        const res = await api.post(ApiPath.SEND_FEEDBACK, body);
        if(res?.data[0]?.data) {
          message.success(res?.message);
          setShowModal(false);
          await getBillList();
        } else {
          message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại")
        }
      })
    } catch (error) {
      console.error(error)
      message.error("Đã có lỗi xảy ra!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!showModal)
      form.resetFields();
  }, [showModal])

  return (
    <Modal
      open={showModal}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button
          key={'submit'}
          className='nav-button h-8'
          onClick={SendFeedback}
          loading={loading}
        >
          Gửi đánh giá
        </Button>
      ]}
      centered
      title={<span className='font-bold'>GỬI ĐÁNH GIÁ</span>}
    >
      <Form layout='vertical' className='py-4' form={form}>
        <Form.Item
          label={<span className='font-bold'>Bạn đánh giá sự kiện bao nhiêu sao?</span>}
          name="rate"
          rules={[{ required: true, message: "Vui lòng chọn mốc sao!" }]}
        >
          <Rate className='w-full text-center' character={<StarFilled />} />
        </Form.Item>
        <Form.Item
          name="context"
          label={<span className='font-bold'>Bình luận</span>}
          rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
        >
          <Input.TextArea showCount maxLength={255} autoSize={{ minRows: 3, maxRows: 10 }} placeholder='Cảm nhận của bạn về sự kiện?' />
        </Form.Item>
      </Form>
    </Modal>
  )
}