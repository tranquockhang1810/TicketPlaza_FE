import React from 'react';
import { 
  AppstoreOutlined, 
  ClusterOutlined, 
  SettingOutlined, 
  BarChartOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  UserOutlined,
  LockOutlined,
  DollarOutlined,
  TagsOutlined,
  IdcardOutlined,
  ContainerOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { Menu } from 'antd';
import { useRouter } from 'next/navigation';

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

export default function SideNav({type}) {

  const router = useRouter();

  const handleClick = (itemKey) => {
    router.push(`/admin/${itemKey}`);
  };

  const items = [
    { type: 'divider'},
    getItem('Trang chủ', '/', <HomeOutlined />),
    getItem('Thống kê', '1', <BarChartOutlined />, [
      getItem('Doanh số', 'profit', <DollarOutlined />), 
      getItem('Lượt check-in', 'check-in', <EnvironmentOutlined />),
      getItem('Lượt view', 'views', <EyeOutlined />), 
      getItem('Lượng vé tiêu thụ', 'ticket-sales', <TagsOutlined />),
    ]),
    getItem('Sự kiện', 'events', <AppstoreOutlined />),
    type === "superAdmin" ?
    getItem('Quản lý chuyên sâu', '3', <ClusterOutlined />, [
      getItem('Loại sự kiện', 'event-type', <ContainerOutlined />),
      getItem('Quản lý tài khoản Admin', 'users', <IdcardOutlined />),
    ]) : null,
    getItem('Cài đặt', '4', <SettingOutlined />, [
      getItem('Thông tin tài khoản', 'account-info', <UserOutlined />),
      getItem('Đổi mật khẩu', 'change-password', <LockOutlined />),
    ]),
  ];

  return (
    <div 
      className='primary-bg inline-block'
      style={{width: "256px", height: "100vh"}}
    >
      <div className='flex w-full justify-center'>
        <div
          className='flex my-5 flex-shrink-0 cursor-pointer'
          onClick={() => {router.push('/')}}
        >
          <img
            className='h-10'
            src="/images/logo.png"
            alt="TicketPlaza"
          />
        </div>
      </div>

      <Menu
        className='mobile-menu'
        onClick={({ key }) => handleClick(key)}
        style={{
          width: 256,
        }}
        mode="inline"
        items={items}
      />
    </div>
  )
}