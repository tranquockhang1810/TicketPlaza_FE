'use client'
import React from 'react';
import { Button, Result } from 'antd';
import { useRouter } from 'next/navigation';

const NotFound = () => {
  const router = useRouter();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Không thể tìm thấy đường dẫn!"
      extra={
        <Button 
          type="primary" 
          className='nav-button'
          onClick={() => router.push('/')}
        >
          Quay về
        </Button>
      }
    />
  )
};
export default NotFound;