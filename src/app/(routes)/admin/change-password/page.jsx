'use client'
import { Col, Form, Input, DatePicker, Row, Button, Select, message } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import confirm from "antd/es/modal/confirm";
import { IndexDisplay, colorTextDisplay, RenderAction, getItemWithColor } from "@/src/utils/DisplayHelper";
import { useEffect, useState } from "react";
import { DateFormat, formatDate } from "@/src/utils/DateFormatter";
import { useUser } from "@/src/context/UserContext";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import dayjs from 'dayjs';

export default function ChangePassword() {
  const [form] = Form.useForm();
  const { user, fetchUserData } = useUser();

  const [loading, setLoading] = useState(false);

  const handleSubmitButton = async () => {
    try {
      setLoading(true);
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
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="font-bold text-3xl text-white text-center pt-20">
        ĐỔI MẬT KHẨU
      </h1>
      <Form form={form} layout="vertical" className="px-80 py-4" onFinish={handleSubmitButton}>
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
          loading={loading}
        >
          Lưu
        </Button>
      </Form>
    </>
  )
}