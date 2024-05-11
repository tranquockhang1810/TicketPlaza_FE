import React from 'react';
import {
  AppstoreOutlined,
  ClusterOutlined,
  SettingOutlined,
  BarChartOutlined,
  EyeOutlined,
  UserOutlined,
  LockOutlined,
  DollarOutlined,
  TagsOutlined,
  IdcardOutlined,
  ContainerOutlined,
  AuditOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import confirm from 'antd/es/modal/confirm';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/context/UserContext';
import { useState } from 'react';
const { Sider, Header } = Layout;

function getItem(label, key, icon, children, type) {
  return { key, icon, children, label, type };
}

const MenuButton = ({ toggleMenu, showMenu }) => (
  <button
    type="button"
    aria-controls="mobile-menu"
    aria-expanded={showMenu}
    onClick={toggleMenu}
    className='p-2 text-white'
  >
    <span className='sr-only'>Open menu</span>
    {showMenu ? (
      <svg
        className='h-6 w-6'
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        width={24}
        height={24}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ) : (
      <svg
        className='h-6 w-6'
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
        width={24}
        height={24}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    )}
  </button>
);

export const MobileMenu = ({ type }) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const { onSignOut } = useUser();

  const toggleMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  const handleClick = (itemKey) => {
    if (itemKey === 'sign-out') {
      setShowMenu(false);
      confirm({
        title: "Bạn có muốn đăng xuất không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: () => {
          onSignOut();
          router.push(`/login`);
        }
      })
    } else {
      setShowMenu(false);
      router.push(`/admin/${itemKey}`);
    } 
  };

  const items = [
    { type: 'divider' },
    getItem('Thống kê', '1', <BarChartOutlined />, [
      getItem('Doanh số', 'profit', <DollarOutlined />),
      getItem('Lượt view', 'views', <EyeOutlined />),
      getItem('Lượng vé tiêu thụ', 'ticket-sales', <TagsOutlined />),
    ]),
    getItem('Lịch sử giao dịch', 'transaction-history', <AuditOutlined />),
    getItem('Sự kiện', 'events', <AppstoreOutlined />),
    type === "superAdmin" ?
      getItem('Quản lý chuyên sâu', '3', <ClusterOutlined />, [
        getItem('Loại sự kiện', 'event-type', <ContainerOutlined />),
        getItem('Tài khoản Admin', 'users', <IdcardOutlined />),
      ]) : null,
    getItem('Cài đặt', '4', <SettingOutlined />, [
      getItem('Thông tin tài khoản', 'account-info', <UserOutlined />),
      getItem('Đổi mật khẩu', 'change-password', <LockOutlined />),
      getItem('Đăng xuất', 'sign-out', <LogoutOutlined />),
    ]),
  ];

  return (
    <>
      <div className='flex w-full justify-between items-center h-full'>
        <div className='flex lg:hidden'>
          <MenuButton showMenu={showMenu} toggleMenu={toggleMenu} />
        </div>
        <div
          className='flex my-5 flex-shrink-0 cursor-pointer'
          onClick={() => { router.push('/') }}
        >
          <img
            className='h-10'
            src="/images/logo.png"
            alt="TicketPlaza"
          />
        </div>
        {showMenu && (
          <div
            className='primary-bg absolute'
            style={{ zIndex: 10000, top: "64px", width: "100%", left: "0" }}
          >
            <Menu
              className='mobile-menu'
              onClick={({ key }) => handleClick(key)}
              mode="inline"
              items={items}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default function SideNav({ type }) {
  const router = useRouter();
  const { onSignOut } = useUser();

  const handleClick = (itemKey) => {
    if (itemKey === 'sign-out') {
      confirm({
        title: "Bạn có muốn đăng xuất không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: () => {
          onSignOut();
          router.push(`/login`);
        }
      })
    } else router.push(`/admin/${itemKey}`);
  };

  const items = [
    { type: 'divider' },
    getItem('Thống kê', '1', <BarChartOutlined />, [
      getItem('Doanh số', 'profit', <DollarOutlined />),
      getItem('Lượt view', 'views', <EyeOutlined />),
      getItem('Lượng vé tiêu thụ', 'ticket-sales', <TagsOutlined />),
    ]),
    getItem('Lịch sử giao dịch', 'transaction-history', <AuditOutlined />),
    getItem('Sự kiện', 'events', <AppstoreOutlined />),
    type === "superAdmin" ?
      getItem('Quản lý chuyên sâu', '3', <ClusterOutlined />, [
        getItem('Loại sự kiện', 'event-type', <ContainerOutlined />),
        getItem('Tài khoản Admin', 'users', <IdcardOutlined />),
      ]) : null,
    getItem('Cài đặt', '4', <SettingOutlined />, [
      getItem('Thông tin tài khoản', 'account-info', <UserOutlined />),
      getItem('Đổi mật khẩu', 'change-password', <LockOutlined />),
      getItem('Đăng xuất', 'sign-out', <LogoutOutlined />),
    ]),
  ];

  return (
    <div
      className='primary-bg inline-block'
      style={{ width: "256px", height: "100vh" }}
    >
      <div className='flex w-full justify-center'>
        <div
          className='flex my-5 flex-shrink-0 cursor-pointer'
          onClick={() => { router.push('/') }}
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