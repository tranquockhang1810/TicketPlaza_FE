'use client'
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Divider, message, Steps } from 'antd';
import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';

export default function SendEmail({
  current,
  setCurrent,
}) {
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
	const [form] = Form.useForm();

  const handleSendEmail = async () => {
    try {
			setLoading(true);
      const params = { email: form.getFieldValue("email"), };
      const res = await api.post(ApiPath.SEND_EMAIL, {}, { params });
			if(res?.data[0].status) {
				message.success(res?.message);
        const query = new URLSearchParams();
        query.append('email', params?.email);
        router.push(`/forgot-password?${query.toString()}`);
        setCurrent(current + 1);
      } else {
        message.error(res?.error?.message);
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
        onFinish={handleSendEmail}
        layout='vertical'
      >
        <Form.Item
          label={<span className="text-white font-bold">Email</span>}
          name="email"
          rules={[{ required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập email!</span> }]}
        >
          <Input type='email' placeholder='Nhập email' autoFocus />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", height: "36px" }}
            className='main-button h-14'
            loading={loading}
          >
            NHẬN OTP
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}