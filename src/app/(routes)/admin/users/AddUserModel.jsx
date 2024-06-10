import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { Modal, Button, Form, Input, message, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import confirm from "antd/es/modal/confirm";
import { colorTextDisplay, getItemWithColor } from "@/src/utils/DisplayHelper";
import dayjs from 'dayjs'
import { DateFormat, formatDate } from "@/src/utils/DateFormatter";

const AddUserModal = ({
  showModal,
  setShowModal,
  getUserList,
  typeList
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleKeyPress = (e) => {
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day');
  };

  const handleSubmitButton = () => {
    form.validateFields().then(async () => {
      try {
        setLoading(true);
        const { fullName, email, phone, identityID, birthDay, type, password, confirmPassword} = form.getFieldValue();
        if (password !== confirmPassword) {
          message.error("Mật khẩu xác nhận chưa chính xác!");
          return;
        }
        const body = {
          fullName,
          email,
          phone,
          identityID,
          birthDay: formatDate(birthDay),
          type,
          password
        };
        const res = await api.post(ApiPath.CREATE_USER, body);
        if(res?.data) {
          message.success(res?.message);
          await getUserList();
          setShowModal(false);
        } else {
          message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
        }
      } catch (error) {
        console.error(error);
        message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
      } finally {
        setLoading(false);
      }
    })
  }

  useEffect(() => {
    form.resetFields();
  }, [showModal]);

  return (
    <Modal
      maskClosable={false}
      open={showModal}
      centered
      destroyOnClose
      title={<span className="text-xl font-bold">Thêm tài khoản mới</span>}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button type="default" key={"cancel"} loading={loading} onClick={() => {
          form.resetFields();
          setShowModal(false);
        }}>
          Hủy
        </Button>,
        <Button type="primary" key={"submit"} loading={loading} className="nav-button" onClick={handleSubmitButton}>
          Lưu
        </Button>
      ]}
    >
      <Form layout="horizontal" form={form} variant={"outlined"}>
        <Form.Item
          label={<span className="font-bold">Họ tên </span>}
          name="fullName"
          rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
        >
          <Input className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Email </span>}
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email" }]}
        >
          <Input type="email" className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Số điện thoại </span>}
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            { min: 10, message: "Số điện thoại phải đủ 10 số!"}
          ]}
        >
          <Input onKeyDown={handleKeyPress} maxLength={10} className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">CCCD </span>}
          name="identityID"
          rules={[
            { required: true, message: "Vui lòng nhập số CCCD!" },
            { min: 12, message: "CCCD phải đủ 12 số!"}
          ]}
        >
          <Input onKeyDown={handleKeyPress} maxLength={12} className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Ngày sinh</span>}
          name="birthDay"
          rules={[
            { required: true, message: "Vui lòng nhập ngày sinh!"},
          ]}
        >
          <DatePicker 
            format={DateFormat}
            allowClear={false}
            readOnly
            suffixIcon={undefined}
            needConfirm={false}
            showNow={false}
            inputReadOnly={true}
            allowEmpty={false}
            className='w-full datePicker-text-right'
            disabledDate={disabledDate}
          />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Loại tài khoản</span>}
          name="type"
          rules={[{ required: true, message: "Vui lòng nhập thể loại" }]}
        >
          <Select 
            className="text-right" 
            options={typeList} 
          />
        </Form.Item>
        <Form.Item
          label={<span className='font-bold'>Mật khẩu</span>}
          name="password"
          colon={false}
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password className="text-right" minLength={6} placeholder='Nhập mật khẩu' />
        </Form.Item>
        <Form.Item
          label={<span className='font-bold'>Xác nhận mật khẩu mới</span>}
          name="confirmPassword"
          colon={false}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password className="text-right" minLength={6} placeholder='Xác nhận lại mật khẩu' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
