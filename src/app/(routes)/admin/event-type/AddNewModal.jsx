import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { Modal, Button, Form, Input, message, Select } from "antd";
import { useEffect, useState } from "react";

const AddNewModal = ({
  showModal,
  setShowModal,
  getTypeList,
  statusList
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmitButton = () => {
    form.validateFields().then(async () => {
      try {
        setLoading(true);
        const params = {
          typeId: form.getFieldValue("typeId") === "" ? undefined : form.getFieldValue("typeId"),
          eventTypeName: form.getFieldValue("eventTypeName") === "" ? undefined : form.getFieldValue("eventTypeName"),
          status:  form.getFieldValue("status") === "" ? undefined : form.getFieldValue("status"),
        };
        const res = await api.post(ApiPath.GET_EVENT_TYPE_LIST, params);
        if(!!res?.data) {
          message.success(res?.message);
          await getTypeList();
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
      open={showModal}
      centered
      destroyOnClose
      title={<span className="text-xl font-bold">Thêm thể loại mới</span>}
      onCancel={() => setShowModal(false)}
      footer={[
        <Button type="primary" key={"submit"} loading={loading} className="nav-button" onClick={handleSubmitButton}>
          Thêm
        </Button>
      ]}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label={<span className="font-bold">Tên thể loại: </span>}
          name="eventTypeName"
          rules={[{ required: true, message: "Vui lòng nhập tên thể loại" }]}
        >
          <Input placeholder="Nhập tên thể loại"/>
        </Form.Item>
        <Form.Item
          label={<span className="font-bold">Mã thể loại: </span>}
          name="typeId"
          rules={[{ required: true, message: "Vui lòng nhập mã thể loại" }]}
        >
          <Input placeholder="Nhập mã thể loại" />
        </Form.Item>
        <Form.Item
          name="status"
          label={<span className="font-bold">Trạng thái</span>}
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select options={statusList}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewModal;
