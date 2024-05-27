'use client'
import { Col, Form, Input, DatePicker, Row, Button, Select, message } from "antd";
import confirm from "antd/es/modal/confirm";
import { IndexDisplay, colorTextDisplay, RenderAction, getItemWithColor } from "@/src/utils/DisplayHelper";
import { useEffect, useState } from "react";
import { DateFormat, formatDate } from "@/src/utils/DateFormatter";
import { useUser } from "@/src/context/UserContext";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import dayjs from 'dayjs';

export default function Profile() {
  const [form] = Form.useForm();
  const { user, fetchUserData } = useUser();

  const [isDisable, setIsDisable] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handleKeyPress = (e) => {
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const handleChangeProfile = async () => {
    if(isDisable) {
      setIsDisable(false);
      return;
    }
    try {
      setProfileLoading(true);
      const { fullName, email, phone, birthDay } = form.getFieldValue();
      const body = {
        fullName,
        email,
        phone,
        birthDay: formatDate(birthDay)
      };
      const params = { userId: user?._id}
      const res = await api.patch(ApiPath.UPDATE_USER, body, { params });
      if(res?.data) {
        message.success(res?.message);
        await fetchUserData(user?._id);
        setIsDisable(true);
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra!");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
      console.error(error);
    } finally {
      setProfileLoading(false)
    }
  }

  const handleChangePassword = async () => {
    try {
      setPasswordLoading(true);
      const { oldPassword, newPassword, confirmNewPassword } = form.getFieldValue();
      const checkPassParams = {
        email: user?.email,
        password: oldPassword
      };
      const checkRes = await api.post(ApiPath.LOGIN, checkPassParams);
      if (!checkRes?.data) {
        message.error(checkRes?.error?.message);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        message.error("Mật khẩu xác nhận chưa chính xác!");
        return;
      }
      const body = {
        email: user?.email,
        password: newPassword
      }
      const res = await api.patch(ApiPath.RESET_PASSWORD, body);
      if(res?.data) {
        message.success(res?.message);
        await fetchUserData();
        form.resetFields();
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra!");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
      console.error(error);
    } finally {
      setPasswordLoading(false)
    }
  }

  return (
    <section className="my-10 flex justify-center flex-wrap">
      <div className='m-4 primary-bg rounded-xl py-10 w-[800px]'>
        <h1 className="font-bold text-white text-center w-full my-2 text-4xl">
          THÔNG TIN TÀI KHOẢN
        </h1>
        <Form form={form} layout="vertical" className="px-10 py-4">
          <Form.Item
            name="fullName"
            label={<span className="font-bold text-white">Họ tên</span>}
            initialValue={user?.fullName}
            rules={[{ required: !isDisable, message: "Vui lòng nhập tên"}]}
          >
            <Input placeholder="Nhập tên" readOnly={isDisable} />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span className="font-bold text-white">Email</span>}
            initialValue={user?.email}
            rules={[{ required: !isDisable, message: "Vui lòng nhập email"}]}
          >
            <Input placeholder="Nhập email" readOnly={isDisable} />
          </Form.Item>
          <Form.Item
            name="phone"
            label={<span className="font-bold text-white">Số điện thoại</span>}
            initialValue={user?.phone}
            rules={[
              { required: !isDisable, message: <span style={{ color: 'white' }}>Vui lòng nhập số điện thoại!</span> },
              { min: 10, message: <span style={{ color: 'white' }}>Số điện thoại phải đủ 10 số!</span>}
            ]}
          >
            <Input placeholder="Nhập số điện thoại" readOnly={isDisable} onKeyDown={handleKeyPress} maxLength={10}/>
          </Form.Item>
          <Form.Item
            name="birthDay"
            label={<span className="font-bold text-white">Ngày sinh</span>}
            initialValue={dayjs(user?.birthDay)}
            style={{pointerEvents: isDisable ? 'none' : 'auto'}}
            rules={[{ required: !isDisable, message: "Vui lòng chọn ngày sinh"}]}
          >
            <DatePicker
              format={DateFormat}
              readOnly={isDisable}
              allowClear={false}
              suffixIcon={undefined}
              needConfirm={false}
              showNow={false}
              inputReadOnly={true}
              allowEmpty={false}
              className={' w-full'}
              disabledDate={disabledDate}
            />
          </Form.Item>
          {isDisable && (
            <>
              <Button 
                onClick={() => setIsDisable(false)}
                className="main-button w-full mt-4 h-8"
              >
                Chỉnh sửa
              </Button>
            </>
          )}
          {!isDisable && (
            <div className="flex flex-col justify-between mt-4">
              <Button 
                type="text" 
                className="main-button w-full mt-4 h-8" 
                htmlType='submit'
                loading={profileLoading}
                onClick={handleChangeProfile}
              >
                Lưu
              </Button>
              <Button type="text"
                className="w-full mt-4 h-8"
                onClick={() => setIsDisable(true)}
              >
                <span className='text-white'>Hủy</span>
              </Button>
            </div>
          )}
        </Form>
      </div>
      <div className='m-4 primary-bg rounded-xl py-10 w-[800px]'>
        <h1 className="font-bold text-white text-center w-full my-2 text-4xl">
          ĐỔI MẬT KHẨU
        </h1>
        <Form form={form} layout="vertical" className="px-10 py-4" onFinish={handleChangePassword}>
          <Form.Item
            label={<span className="text-white font-bold">Mật khẩu cũ</span>}
            name="oldPassword"
            rules={[
              { required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập mật khẩu!</span> },
              { min: 6, message: <span style={{ color: 'white' }}>Mật khẩu phải có ít nhất 6 ký tự!</span> }
            ]}
          >
            <Input.Password minLength={6} placeholder='Nhập mật khẩu' />
          </Form.Item>
          <Form.Item
            label={<span className="text-white font-bold">Mật khẩu mới</span>}
            name="newPassword"
            rules={[
              { required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập mật khẩu!</span> },
              { min: 6, message: <span style={{ color: 'white' }}>Mật khẩu phải có ít nhất 6 ký tự!</span> }
            ]}
          >
            <Input.Password minLength={6} placeholder='Nhập mật khẩu' />
          </Form.Item>
          <Form.Item
            label={<span className="text-white font-bold">Xác nhận mật khẩu mới</span>}
            name="confirmNewPassword"
            rules={[
              { required: true, message: <span style={{ color: 'white' }}>Vui lòng nhập mật khẩu!</span> },
              { min: 6, message: <span style={{ color: 'white' }}>Mật khẩu phải có ít nhất 6 ký tự!</span> },
            ]}
          >
            <Input.Password minLength={6} placeholder='Xác nhận lại mật khẩu' />
          </Form.Item>
          <Button 
            type="text" 
            className="main-button w-full mt-4 h-8" 
            htmlType='submit'
            loading={passwordLoading}
          >
            Lưu
          </Button>
        </Form>
      </div>
    </section>
  )
}