'use client'
import React, { useState } from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';

export default function Login() {
	const [loading, setLoading] = useState(false);
  const {
    user,
    onSignIn
  } = useUser();
  const router = useRouter();
	const [form] = Form.useForm();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      router.push("http://localhost:8000/users/auth/google");
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleLocalSignIn = async () => {
    try {
			setLoading(true);
      const params = { 
				email: form.getFieldValue("email"), 
				password: form.getFieldValue("password") 
			};
      const res = await api.post(ApiPath.LOGIN, params);
			if(!!res?.data) {
				message.success(res?.message);
        onSignIn(res?.data[0]);
        router.push("/");
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
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        style={{ width: "800px" }}
        className='rounded-xl primary-bg p-16'
      >
        <Button
          className='nav-button'
          size='large'
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/')}
        />
        <h1 className='text-center font-bold text-3xl text-white'>
          ĐĂNG NHẬP
        </h1>
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={handleLocalSignIn}
          layout='vertical'
        >
          <Form.Item
            label={<span className="text-white font-bold">Email</span>}
            name="email"
            rules={[{ required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập email!</span> }]}
          >
            <Input type='email' placeholder='Nhập email' autoFocus />
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
          <div className="flex justify-end mb-2">
            <span
              className="text-white hover:font-bold hover:underline hover:cursor-pointer"
            >
              Quên mật khẩu?
            </span>
          </div>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", height: "36px" }}
              className='main-button'
              loading={loading}
            >
              ĐĂNG NHẬP
            </Button>
            <div className="flex justify-center mt-5">
              <span
                className="text-white hover:font-bold hover:underline hover:cursor-pointer"
              >
                Chưa có tài khoản? Đăng ký ngay!
              </span>
            </div>
          </Form.Item>
          <Divider style={{ backgroundColor: "white" }} />
          <Form.Item>
						<Button
							type="primary"
							style={{ width: "100%", height: "36px" }}
							className='main-button'
							icon={<GoogleOutlined />}
							onClick={handleGoogleSignIn}
						>
							Đăng nhập bằng Google
						</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
