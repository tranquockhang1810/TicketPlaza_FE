import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { Modal, Button, Form, Input, message, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import confirm from "antd/es/modal/confirm";
import { colorTextDisplay, getItemWithColor } from "@/src/utils/DisplayHelper";
import dayjs from 'dayjs'
import { DateFormat, formatDate } from "@/src/utils/DateFormatter";

const UserDetailModal = ({
  record,
  showModal,
  setShowModal,
  getUserList,
  statusList,
  typeList
}) => {
  const [form] = Form.useForm();
  const [isDisable, setIsDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const RenderStatus = (status) => {
    const {title, color} = getItemWithColor(statusList, status);
    return colorTextDisplay(title, color);
  }

  const handleSubmitButton = () => {
    if(isDisable){
      setIsDisable(false);
    } else {
      form.validateFields().then(async () => {
        try {
          setLoading(true);
          const { type } = form.getFieldValue();
          const body = {
            type
          };
          const params = { userId: record?._id };
          const res = await api.patch(ApiPath.UPDATE_USER, body, { params });
          if(res?.data) {
            message.success(res?.message);
            await getUserList();
            setIsDisable(true);
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
  }

  const ActivateType = (record) => {
    return (
      confirm({
        title: "Bạn có muốn kích hoạt tài khoản này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk:  async () => {
          try {
            setLoading(true);
            const params = { userId: record?._id}; 
            const body = {};
            const res = await api.patch(ApiPath.ACTIVATE_USER, body, { params });
            if(!!res?.data) {
              await getUserList();
              message.success(res?.message);
              setShowModal(false)
            } else {
              message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
            }
          } catch (error) {
            console.error(error);
            message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
          } finally {
            setLoading(false);
          }
        }
      })
    )
  }

  useEffect(() => {
    form.resetFields();
    setIsDisable(true);
  }, [showModal]);

  return (
    <Modal
      maskClosable={false}
      open={showModal}
      centered
      destroyOnClose
      title={<span className="text-xl font-bold">Thông tin chi tiết</span>}
      onCancel={() => setShowModal(false)}
      footer={[
        record?.status === 1 && isDisable ? 
        <Button 
          type="primary" 
          loading={loading} 
          className="main-button" 
          style={{backgroundColor: "green"}} 
          onClick={() => ActivateType(record)}
        >
          Kích hoạt tài khoản
        </Button> : undefined,
        !isDisable ?
        <Button type="default" loading={loading} onClick={() => {
          form.resetFields();
          setIsDisable(true);
        }}>
          Hủy
        </Button>: undefined,
        <Button type="primary" loading={loading} className="nav-button" onClick={handleSubmitButton}>
          {isDisable ? "Chỉnh sửa" : "Lưu"}
        </Button>
      ]}
    >
      <Form layout="horizontal" form={form} variant={isDisable ? "borderless" : "outlined"}>
        <Form.Item
          label={<span className="font-bold">Họ tên </span>}
          name="fullName"
          initialValue={record?.fullName}
        >
          <Input readOnly={true} className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Email </span>}
          name="email"
          initialValue={record?.email}
        >
          <Input type="email" readOnly={true} className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Số điện thoại </span>}
          name="phone"
          initialValue={record?.phone}
        >
          <Input maxLength={10} readOnly={true} className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">CCCD </span>}
          name="identityID"
          initialValue={record?.identityID}
        >
          <Input maxLength={12} readOnly={true} className="text-right"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Ngày sinh</span>}
          name="birthDay"
          initialValue={dayjs(record?.birthDay)}
          style={{ pointerEvents: 'none'}}
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
          />
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Loại tài khoản</span>}
          name="type"
          initialValue={record?.type}
          rules={[{ required: !isDisable, message: "Vui lòng nhập thể loại" }]}
          style={{ pointerEvents: isDisable ? 'none' : 'auto' }}
        >
          <Select 
            className="text-right" 
            options={typeList} 
          />
        </Form.Item>
        {isDisable && statusList && (
          <div className="flex justify-between text-base">
            <span className="font-bold">Trạng thái: </span>
            {RenderStatus(record?.status)}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UserDetailModal;
