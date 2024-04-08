import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { Modal, Button, Form, Input, message } from "antd";
import { useEffect, useState } from "react";
import confirm from "antd/es/modal/confirm";
import { colorTextDisplay, getItemWithColor } from "@/src/utils/DisplayHelper";

const EventTypeDetailModal = ({
  record,
  showModal,
  setShowModal,
  getTypeList,
  statusList
}) => {
  const [form] = Form.useForm();
  const [isDisable, setIsDisable] = useState(true);
  const [loading, setLoading] = useState(false);

  const RenderStatus = (status) => {
    const {title, color} = getItemWithColor(statusList,status);
    return colorTextDisplay(title, color);
  }

  const handleSubmitButton = () => {
    if(isDisable){
      setIsDisable(false);
    } else {
      form.validateFields().then(async () => {
        try {
          setLoading(true);
          const body = {
            typeId: form.getFieldValue("typeId") === "" ? undefined : form.getFieldValue("typeId"),
            eventTypeName: form.getFieldValue("eventTypeName") === "" ? undefined : form.getFieldValue("eventTypeName"),
          };
          const params = { eventTypeId: record?._id };
          const res = await api.patch(ApiPath.UPDATE_EVENT_TYPE, body, { params });
          if(!!res?.data) {
            message.success(res?.message);
            await getTypeList();
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
        title: "Bạn có muốn kích hoạt thể loại này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: async () => {
          try {
            setLoading(true);
            const params = { eventTypeId: record?._id};
            const body = {};
            const res = await api.patch(ApiPath.ACTIVATE_EVENT_TYPE, body ,{ params });
            if(!!res?.data) {
              await getTypeList();
              message.success(res?.message );
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
          Kích hoạt thể loại
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
          label={<span className="font-bold">Tên thể loại </span>}
          name="eventTypeName"
          initialValue={record?.eventTypeName}
          rules={[{ required: !isDisable, message: "Vui lòng nhập tên thể loại" }]}
        >
          <Input readOnly={isDisable}/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Mã thể loại </span>}
          name="typeId"
          initialValue={record?.typeId}
          rules={[{ required: !isDisable, message: "Vui lòng nhập mã thể loại" }]}
        >
          <Input readOnly={isDisable}/>
        </Form.Item>
        {isDisable && (
          <div className="flex justify-start text-base">
            <span className="font-bold mr-4">Trạng thái: </span>
            {RenderStatus(record?.status)}
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default EventTypeDetailModal;
