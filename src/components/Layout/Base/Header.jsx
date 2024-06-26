'use client'
import { Dropdown, Menu, Input, Button, Space, Divider, Tooltip, message } from 'antd';
import { GlobalOutlined, UserOutlined, SearchOutlined } from '@ant-design/icons';
import { useUser } from '@/src/context/UserContext';
import Headroom from 'react-headroom';
import React, { useState } from 'react';

const HEADERS = [
  {
    label: `CÁC SỰ KIỆN`,
    path: `/events`,
  },
  {
    label: `KHUYẾN MÃI`,
    path: `/promotion`,
  },
  {
    label: `GIỚI THIỆU`,
    path: `/about-us`,
  }
];

const AccountOptions = [
  { key: 'profile', label: 'Thông tin'},
  { key: 'bills', label: 'Lịch sử vé'},
  { key: 'admin', label: 'Dành cho Admin' },
  { key: 'logout', label: 'Đăng xuất' }
];

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

const MobileMenu = ({history}) => {
  const {
    onSignOut,
    isAuthenticated,
    isAdmin
  } = useUser();
  const [searchValue, setSearchValue] = useState('');
  const handleItemClick = ({ key }) => {
    if (key === 'logout') {
      onSignOut();
      message.success("Đăng xuất thành công!");
      history.refresh();
      return;
    }
  
    if (key === 'admin' && !isAdmin()) {
      message.info("Mục này chỉ dành cho tài khoản admin!");
      return;
    }
  
    const path = '/' + key;
    history.push(path);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    const searchQuery = searchValue.trim() ? `?keyword=${encodeURIComponent(searchValue.trim())}` : '';
    history.push(`/events${searchQuery}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const MobileItems = [
    {
      key: 'login',
      children: null,
      label: isAuthenticated() ? 'TÀI KHOẢN' : 'ĐĂNG NHẬP / ĐĂNG KÝ',
    },
    { key: 'events', icon: null, children: null, label: 'CÁC SỰ KIỆN' },
    { key: 'promotion', icon: null, children: null, label: 'KHUYẾN MÃI' },
    { key: 'about-us', icon: null, children: null, label: 'GIỚI THIỆU' },
  ];
  

  if (isAuthenticated()) {
    MobileItems[0].children = [
      { key: 'profile', icon: null, children: null, label: 'Thông tin' },
      { key: 'bills', icon: null, children: null, label: 'Lịch sử vé' },
      { key: 'admin', icon: null, children: null, label: 'Dành cho Admin' },
      { key: 'logout', icon: null, children: null, label: 'Đăng xuất' },
    ];
  }

  return (
    <div className="lg:hidden absolute w-full slide-bottom-15" style={{ backgroundColor: '#6E1010' }}>
      <div className="px-5 pt-2 pb-3 space-y-1">
        <Menu
          className='mobile-menu' 
          mode="inline" 
          onClick={handleItemClick}
          items={MobileItems}
        />
        <Space.Compact
          className='w-full'
          style={{width: "100%"}}
        >
          <Input 
            className='search-input w-full'
            placeholder="Tìm kiếm tên sự kiện"
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <Button 
            style={{width: "100%"}}
            className='search-button flex items-center'
            icon={<SearchOutlined 
            style={{ fontSize: '20px' }} />}
            onClick={handleSearch}
          />
        </Space.Compact>
      </div>
    </div>
  );
};

export default function Header({history}) {
  const [showMenu, setShowMenu] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const {
    isAuthenticated,
    onSignOut,
    isAdmin
  } = useUser();
  const [language, setLanguage] = useState('VN');

  const handleLoginClick = () => {
    history.push("/login");
  };
  
  const handleAccountOptionClick = ({ key }) => {
    if (key === 'logout') {
      onSignOut();
      message.success("Đăng xuất thành công!");
      history.refresh();
      history.push('/');
      return;
    }
  
    if (key === 'admin' && !isAdmin()) {
      message.info("Mục này chỉ dành cho tài khoản admin!");
      return;
    }
  
    const path = '/' + key;
    history.push(path);
  };
  
  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    const searchQuery = searchValue.trim() ? `?keyword=${encodeURIComponent(searchValue.trim())}` : '';
    history.push(`/events${searchQuery}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleToggleLanguage = () => {
      const newLanguage = language === 'VN' ? 'EN' : 'VN';
      setLanguage(newLanguage);
  };

  const toggleMenu = (e) => {
    e.preventDefault();
    setShowMenu(!showMenu);
  };

  return (
    <nav>
      <Headroom
        style={{
          transition: 'all .5s ease-in-out',
          backgroundColor: '#6E1010',
          zIndex: 30,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
        }}
        onUnpin={() => setShowMenu(false)}
      >
        <div className='max-w-7xl mx-auto px-6 pt-2.5'>
          <div className='bg-header flex items-center justify-between py-2'>
            {/* Logo */}
            <div className='flex items-stretch'>
              <div
                className='flex mt-auto flex-shrink-0 cursor-pointer'
                onClick={() => {history.push('/')}}
              >
                <img
                  className='h-12'
                  src="/images/logo.png"
                  alt="TicketPlaza"
                />
              </div>
            </div>

            {/* Others */}
            <div className='hidden lg:flex items-center justify-around w-4/5'>
              {/* Search bar */}
              <div
                className='flex item-stretch'
              >
                <Space.Compact>
                  <Input 
                    className='search-input w-[380px]'
                    placeholder="Tìm kiếm tên sự kiện"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                  />
                  <Button 
                    className='search-button flex items-center'
                    icon={<SearchOutlined style={{ fontSize: '20px' }} />}
                    onClick={handleSearch}
                  >
                  </Button>
                </Space.Compact>
              </div>
              {/* Login */}
              <div className='flex items-stretch'>
                {isAuthenticated() ? ( 
                  <Dropdown 
                    overlay={
                      <Menu 
                        onClick={handleAccountOptionClick}
                        className='desktop-dropdown-menu'
                      >
                        {AccountOptions.map((option) => (
                          <Menu.Item key={option.key}>{option.label}</Menu.Item>
                        ))}
                      </Menu>
                    } 
                    trigger={['hover']}
                  >
                    <Button className='main-button h-14 flex items-center'>
                      <UserOutlined style={{ fontSize: '20px' }} />
                      TÀI KHOẢN
                    </Button>
                  </Dropdown>
                ) : (
                  <Button className='main-button h-14 flex items-center' onClick={handleLoginClick}>
                    <UserOutlined style={{ fontSize: '20px' }} />
                    ĐĂNG NHẬP / ĐĂNG KÝ
                  </Button>
                )}
              </div>
            </div> 

            {/* Language - Mobile Button */}
            <div
              className='flex item-stretch justify-around'
            >
              <Tooltip 
                title={language === 'VN' ? 
                'Thay đổi ngôn ngữ sang Tiếng Anh' :
                'Thay đổi ngôn ngữ sang Tiếng Việt'
              }
              >
                <Button
                  className='main-button h-14 flex items-center'
                  id='lang-btn'
                  icon={<GlobalOutlined style={{ fontSize: '20px'}}/>}
                  onClick={handleToggleLanguage}
                >
                  {language}
                </Button>
              </Tooltip>  

              {/*Mobile Buttons */}
              <div className='-mr-2 flex lg:hidden'>
                <MenuButton showMenu={showMenu} toggleMenu={toggleMenu} />
              </div>
            </div>
          </div>
        </div>
        {showMenu ? <MobileMenu history={history}/> : null}
        <Divider className='border-t-1 my-2' style={{borderTopColor: '#D6A2A2'}} />
        <div className='max-w-7xl mx-auto px-6 pb-2.5 hidden lg:flex h-full justify-end'>
          <div className='bg-header flex items-center'>
            {/* Buttons */}
            <div className='flex items-stretch'>
              {HEADERS.map((link) => (
                <div
                  key={link.label}
                  className='nav-button h-14 flex items-center ml-10 text-center'
                  onClick={() => history.push(link.path)}
                >
                  {link.label}
                </div>
                )
              )}
            </div>
          </div>
        </div>
      </Headroom>
    </nav>
)}