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

export default function AccountInfo() {
  const [form] = Form.useForm();
  const { user, fetchUserData } = useUser();

  const [isDisable, setIsDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const typeList = [
    { label: "Admin", value: 1, color: "" },
    { label: "Super Admin", value: 2, color: ""}
  ]

  const RenderType = (type) => {
    const {title, color} = getItemWithColor(typeList, type);
    return colorTextDisplay(title, color);
  }

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handleKeyPress = (e) => {
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const handleSubmitButton = async () => {
    if(isDisable) {
      setIsDisable(false);
      return;
    }
    try {
      setLoading(true);
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
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="font-bold text-3xl text-white text-center pt-20">
        THÔNG TIN TÀI KHOẢN
      </h1>
      <Form form={form} layout="vertical" className="xl:px-80 px-4 py-4" onFinish={handleSubmitButton}>
        <Form.Item
          name="fullName"
          label={<span className="text-white font-bold">Họ tên</span>}
          initialValue={user?.fullName}
          rules={[{ required: !isDisable, message: "Vui lòng nhập tên"}]}
        >
          <Input placeholder="Nhập tên" readOnly={isDisable} />
        </Form.Item>
        <Form.Item
          name="email"
          label={<span className="text-white font-bold">Email</span>}
          initialValue={user?.email}
          rules={[{ required: !isDisable, message: "Vui lòng nhập email"}]}
        >
          <Input placeholder="Nhập email" readOnly={isDisable} />
        </Form.Item>
        <Form.Item
          name="phone"
          label={<span className="text-white font-bold">Số điện thoại</span>}
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
          label={<span className="text-white font-bold">Ngày sinh</span>}
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
            <div className="flex justify-between text-base text-white">
              <span className="font-bold">Trạng thái: </span>
              {RenderType(user?.type)}
            </div>
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
              loading={loading}
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
    </>
  )
}