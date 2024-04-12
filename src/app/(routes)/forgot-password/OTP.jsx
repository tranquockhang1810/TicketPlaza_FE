'use client'
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Divider, message, Steps } from 'antd';
import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';

export default function OTP({
  current,
  setCurrent,
}) {
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
	const [form] = Form.useForm();

  const handleSendOTP = async () => {
    try {
			setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email');
      const params = {
        email: email,
        otp: form.getFieldValue("otp")
      }
      const res = await api.post(ApiPath.VERIFY_OTP, {}, { params });
			if(res?.data[0]?.status === 0) {
        message.success(res?.message);
        setCurrent(current+1);
      } else {
        message.error(res?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={handleSendOTP}
        layout='horizontal'
      >
        <Form.Item
          name="otp"
          colon={false}
          rules={[{ required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập mã OTP</span> }]}
          className='flex justify-center'
        >
          <Input.OTP length={4} size='large' className='w-full'/>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", height: "36px" }}
            className='main-button  h-14'
            loading={loading}
          >
            GỬI OTP
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}