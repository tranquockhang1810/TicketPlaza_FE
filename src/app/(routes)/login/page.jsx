'use client'
import React, { useState, useEffect, Suspense } from 'react';
import { Form, Input, Button, Divider, message } from 'antd';
import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';

export default function Login() {
	const [loading, setLoading] = useState(false);
  const [googleLogin, SetGoogleLogin] = useState(false);
  const {
    user,
    onSignIn
  } = useUser();
  const router = useRouter();
	const [form] = Form.useForm();
  const search = useSearchParams();

  const handleGoogleSignIn = () => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const res = JSON.parse(urlParams.get('data'));
      if(res?.data) {
				message.success(res?.message);
        onSignIn(res?.data[0]);
        router.push("/");
      }
    } catch (error) {
      message.error("Đăng nhập bằng Google thất bại!");
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
        if (search.get('order')) {
          router.push(`/events/${search.get('order')}`);  
          return;
        }
        if (res?.data[0]?.data?.type !== 0) {
          router.push("/admin");
        } else router.push("/");
      } else {
        message.error(res?.error?.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGoogleSignIn()
  }, [googleLogin]);

  return (
    <Suspense>
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
            onClick={() => router.back()}
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
                onClick={() => router.push('/forgot-password')}
              >
                Quên mật khẩu?
              </span>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", height: "36px" }}
                className='main-button h-14'
                loading={loading}
              >
                ĐĂNG NHẬP
              </Button>
              <div className="flex justify-center mt-5">
                <span
                  className="text-white hover:font-bold hover:underline hover:cursor-pointer"
                  onClick={() => router.push('sign-up')}
                >
                  Chưa có tài khoản? Đăng ký ngay!
                </span>
              </div>
            </Form.Item>
            <Divider style={{ backgroundColor: "white" }} />
            <Form.Item>
              <Button
                loading={loading}
                type="primary"
                style={{ width: "100%", height: "36px" }}
                className='main-button h-14'
                icon={<GoogleOutlined />}
                onClick={() => {
                  SetGoogleLogin(true);
                  router.push(ApiPath.GOOGLE_LOGIN_UI);
              } }
              >
                Đăng nhập bằng Google
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Suspense>
  );
}
