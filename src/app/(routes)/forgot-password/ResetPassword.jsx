'use client'
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Divider, message, Steps } from 'antd';
import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';

export default function ResetPassword({
  current,
  setCurrent,
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
	const [form] = Form.useForm();

  const handleUpdatePassword = async () => {
    try {
			setLoading(true);
      const { newPassword, confirmNewPassword} = form.getFieldValue();
      if ( newPassword !== confirmNewPassword){
        message.error("Mật khẩu xác nhận không chính xác!");
        return;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email');
      const params = {
        email: email,
        password: newPassword
      }
      const res = await api.patch(ApiPath.RESET_PASSWORD, params);
			if(res?.data[0].data) {
				message.success(`${res?.message} Vui lòng đăng nhập lại!`);
        router.push("/login");
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
        onFinish={handleUpdatePassword}
        layout='vertical'
      >
        <Form.Item
          label={<span className='font-bold text-white'>Mật khẩu mới</span>}
          name="newPassword"
          colon={false}
          rules={[{ required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập mật khẩu mới</span> }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={<span className='font-bold text-white'>Xác nhận mật khẩu mới</span>}
          name="confirmNewPassword"
          colon={false}
          rules={[{ required: true, message: <span style={{ color: 'white' }}>Vui lòng xác nhận mật khẩu mới</span> }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", height: "36px" }}
            className='main-button  h-14'
            loading={loading}
          >
            Xác nhận
          </Button>
        </Form.Item>
      </Form>

    </>
  )
}