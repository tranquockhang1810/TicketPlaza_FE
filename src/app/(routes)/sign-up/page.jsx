'use client'
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, InputNumber, DatePicker } from 'antd';
import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import { formatDate } from '@/src/utils/DateFormatter';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';
import dayjs from 'dayjs';

export default function SignUp() {
  const [loading, setLoading] = useState(false);
  const {
    user,
    onSignIn
  } = useUser();
  const router = useRouter();
	const [form] = Form.useForm();

  const handleKeyPress = (e) => {
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      form.validateFields();
      if (form.getFieldValue("password") !== form.getFieldValue("confirmPassword")) {
        message.error("Mật khẩu xác nhận chưa chính xác!");
        return;
      }
      const params = {
        fullName: form.getFieldValue("fullName"),
        email: form.getFieldValue("email"),
        password: form.getFieldValue("password"),
        phone: form.getFieldValue("phone"),
        birthDay: formatDate(form.getFieldValue("birthDay"))
      }
      const res = await api.post(ApiPath.SIGNUP, params);
      if(!!res?.data) {
        if(res?.message === "Email đã được sử dụng!") {
          message.error(res?.message);
          return;
        }
				message.success(res?.message);
        onSignIn(res?.data[0]);
        router.push("/");
      } else {
        message.error(res?.error?.message);
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        style={{ width: "800px" }}
        className='rounded-xl primary-bg p-16'
      >
        <Button
          className='nav-button h-14'
          size='large'
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/')}
        />
        <h1 className='text-center font-bold text-3xl text-white'>
          ĐĂNG KÝ
        </h1>
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={handleSignUp}
          layout='vertical'
        >
          <Form.Item
            label={<span className="text-white font-bold">Họ và tên</span>}
            name="fullName"
            rules={[{ required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập họ tên!</span> }]}
          >
            <Input type='text' placeholder='Nhập họ và tên' autoFocus />
          </Form.Item>
          <Form.Item
            label={<span className="text-white font-bold">Email</span>}
            name="email"
            rules={[{ required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập email!</span> }]}
          >
            <Input type='email' placeholder='Nhập email' />
          </Form.Item>
          <Form.Item
            label={<span className="text-white font-bold">Số điện thoại</span>}
            name="phone"
            rules={[
              { required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập số điện thoại!</span> },
              { min: 10, message: <span style={{ color: 'white' }}>Số điện thoại phải đủ 10 số!</span>}
            ]}
          >
            <Input 
              className='w-full' 
              maxLength={10} 
              controls={false} 
              placeholder='Nhập số điện thoại' 
              onKeyDown={handleKeyPress}
            />
          </Form.Item>
          <Form.Item
            label={<span className="text-white font-bold">Ngày sinh</span>}
            name="birthDay"
            rules={[
              { required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập ngày sinh!</span> },
            ]}
          >
            <DatePicker className='w-full' disabledDate={disabledDate} format={"DD/MM/YYYY"} placeholder='Chọn ngày sinh' />
          </Form.Item>
          <Form.Item
            label={<span className="text-white font-bold">Mật khẩu</span>}
            name="password"
            rules={[
              { required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập mật khẩu!</span> },
              { min: 6, message: <span style={{ color: 'white' }}>Mật khẩu phải có ít nhất 6 ký tự!</span> }
            ]}
          >
            <Input.Password minLength={6} placeholder='Nhập mật khẩu' />
          </Form.Item>
          <Form.Item
            label={<span className="text-white font-bold">Xác nhận mật khẩu</span>}
            name="confirmPassword"
            rules={[
              { required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập mật khẩu!</span> },
              { min: 6, message: <span style={{ color: 'white' }}>Mật khẩu phải có ít nhất 6 ký tự!</span> },
            ]}
          >
            <Input.Password minLength={6} placeholder='Xác nhận lại mật khẩu' />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: "36px" }}
              className='main-button h-14'
              loading={loading}
            >
              ĐĂNG KÝ
            </Button>
            <div className="flex justify-center mt-5">
              <span
                className="text-white hover:font-bold hover:underline hover:cursor-pointer"
                onClick={() => router.push('/login')}
              >
                Đã có tài khoản? Đăng nhập ngay!
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}