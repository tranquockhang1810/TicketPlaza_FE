'use client'
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Divider, message, Steps } from 'antd';
import { ArrowLeftOutlined, GoogleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';
import SendEmail from './SendEmail';
import OTP from './OTP';
import ResetPassword from './ResetPassword';

export default function ForgotPassword() {
	const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const {
    user,
    onSignIn
  } = useUser();

  
  const items = [
    {
      key: 0,
      title: 'Email khôi phục',
      content: <SendEmail current={current} setCurrent={setCurrent}/>
    },
    {
      key: 1,
      title: 'Xác thực OTP',
      content: <OTP current={current} setCurrent={setCurrent}/>
    },
    {
      key: 2,
      title: 'Mật khẩu mới',
      content: <ResetPassword current={current} setCurrent={setCurrent}/>
    }
  ]

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        style={{ width: "800px" }}
        className='rounded-xl primary-bg p-16'
      >
        <Steps 
          current={current}
          items={items}
          className='steps-custom'
        />
        <Button
          className='nav-button h-14 mt-4'
          size='large'
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            if (current === 1) {
              router.back();
              setCurrent(0);
            } else
            router.push('/login')
          }}
        >
          {current === 1 && "Nhập Email khác"}
        </Button>
        <h1 className='text-center font-bold text-3xl text-white mb-4'>
          {items[current].title.toUpperCase()}
        </h1>
        <div>
          {items[current].content}
        </div>
      </div>
    </div>
  );
}
