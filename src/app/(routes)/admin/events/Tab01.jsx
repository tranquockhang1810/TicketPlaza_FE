'use client'
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { Button, Form, Input, InputNumber, message, DatePicker, Select, Image, Upload, ConfigProvider } from "antd";
import { UploadOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop';
import { useEffect, useState } from "react";
import confirm from "antd/es/modal/confirm";
import { colorTextDisplay, getItemWithColor } from "@/src/utils/DisplayHelper";
import { DateTimeFormat, DateFormat, dateWithUct, getDiffDate } from "@/src/utils/DateFormatter";
import dayjs from 'dayjs';
import { useUser } from "@/src/context/UserContext";

export default function Tab01({
  record,
  showModal,
  setShowModal,
  typeList,
  getEvents,
  statusList,
  forCreate,
}) {
  const [form] = Form.useForm();
  const [isDisable, setIsDisable] = useState(!forCreate);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgBase64String, setImgBase64String] = useState("");
  const [dateType, setDateType] = useState("");
  const { user } = useUser();

  const RenderStatus = (status) => {
    const { title, color } = getItemWithColor(statusList, status);
    return colorTextDisplay(title, color);
  }

  const handleSubmitButton = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      const { name, type, place, dateSingle, dateRange, description, dateType, maxTicketPerBill } = form.getFieldsValue();
      const body = {
        host: forCreate ? user?._id : undefined,
        name: name !== "" ? name : undefined,
        type: type !== "" ? type : undefined,
        place: place !== "" ? place : undefined,
        date: dateType === "single" ? dateWithUct(dateSingle, dateType) : dateWithUct(dateRange[0], dateType),
        durationDate: dateType === "range" ? getDiffDate(dateRange[0], dateRange[1]) : 0,
        description: description !== "" ? description : undefined,
        photo: imgBase64String !== "" ? imgBase64String : undefined,
        maxTicketPerBill: maxTicketPerBill,
      };
      const params = { eventId: record?._id };
      let res = "";
      if (forCreate) {
        res = await api.post(ApiPath.CREATE_EVENT, body);
      } else {
        res = await api.patch(ApiPath.UPDATE_EVENT, body, { params });
      }
      if (res?.data[0]?.data) {
        message.success(res?.message);
        await getEvents();
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

  const ActivateType = () => {
    return (
      confirm({
        title: "Bạn có muốn kích hoạt sự kiện này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: async () => {
          try {
            setLoading(true);
            const params = { eventId: record?._id };
            const body = {};
            const res = await api.patch(ApiPath.ACTIVATE_EVENT, body, { params });
            if (!!res?.data) {
              await getEvents();
              message.success(res?.message);
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

  const ResetAll = () => {
    form.resetFields();
    setSelectedImage(null);
    setDateType(record?.durationDate === 0 ? "single" : "range")
    setIsDisable(!forCreate);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file instanceof File) {
        reject(new Error('Invalid file'));
        return;
      }
      const reader = new FileReader();
      reader.onload = function (event) {
        const base64String = event.target.result;
        resolve(base64String);
      };
      reader.readAsDataURL(file);
    });
  }

  useEffect(() => {
    ResetAll();
  }, [showModal]);

  return (
    <>
      <Form layout="horizontal" form={form} variant={isDisable ? "borderless" : "outlined"}>
        {/* Tên sk */}
        <Form.Item
          label={<span className="font-bold">Tên sự kiện</span>}
          name="name"
          initialValue={record?.name}
          rules={[{ required: !isDisable, message: "Vui lòng nhập tên thể loại" }]}
        >
          <Input className="text-right" readOnly={isDisable} />
        </Form.Item>
        {/* Thể loại */}
        <Form.Item
          label={<span className="font-bold">Thể loại</span>}
          name="type"
          initialValue={record?.type}
          rules={[{ required: !isDisable, message: "Vui lòng nhập thể loại" }]}
        >
          <Select
            className="text-right"
            options={typeList}
            style={{ pointerEvents: isDisable ? 'none' : 'auto' }}
          />
        </Form.Item>
        {/* Địa chỉ */}
        <Form.Item
          label={<span className="font-bold">Địa chỉ</span>}
          name="place"
          initialValue={record?.place}
          rules={[{ required: !isDisable, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input className="text-right" readOnly={isDisable} />
        </Form.Item>
        {/* Hiển thị Date */}
        {isDisable && (
          <Form.Item
            label={<span className="font-bold">Thời gian</span>}
            name="date"
            initialValue={
              record?.durationDate > 0
                ? [dayjs(record?.date), dayjs(record?.date).add(record?.durationDate, 'day')]
                : dayjs(record?.date)
            }
            rules={[{ required: !isDisable, message: 'Vui lòng nhập thời gian' }]}
            style={{ pointerEvents: 'none' }}
          >
            {isDisable && (
              record?.durationDate > 0 ? (
                <DatePicker.RangePicker
                  className="w-full datePicker-text-right"
                  suffixIcon={undefined}
                  inputReadOnly={isDisable}
                  readOnly={isDisable}
                  allowClear={false}
                  format={DateFormat}
                  allowEmpty={false}
                />
              ) : (
                <DatePicker
                  className="w-full datePicker-text-right"
                  suffixIcon={undefined}
                  showTime
                  needConfirm={false}
                  showNow={false}
                  inputReadOnly={isDisable}
                  readOnly={isDisable}
                  allowClear={false}
                  allowEmpty={false}
                  format={DateTimeFormat}
                />
              )
            )}
          </Form.Item>
        )}
        {/* Chỉnh sửa date */}
        {!isDisable && (
          <>
            <Form.Item
              label={<span className="font-bold">Kéo dài</span>}
              name="dateType"
              rules={[{ required: !isDisable, message: "Vui lòng chọn loại ngày" }]}
              initialValue={dateType}
            >
              <Select
                onChange={(value) => { setDateType(value) }}
                className="text-right">
                <Select.Option value="single">Trong ngày</Select.Option>
                <Select.Option value="range">Khoảng thời gian</Select.Option>
              </Select>
            </Form.Item>
            {dateType === 'range' && (
              <Form.Item
                label={<span className="font-bold">Khoảng thời gian</span>}
                name='dateRange'
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                initialValue={form.getFieldValue('date')}
              >
                <DatePicker.RangePicker
                  className="w-full datePicker-text-right"
                  suffixIcon={undefined}
                  inputReadOnly={isDisable}
                  readOnly={isDisable}
                  allowClear={false}
                  format={DateFormat}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                />
              </Form.Item>
            )}
            {dateType === 'single' && (
              <Form.Item
                label={<span className="font-bold">Thời gian</span>}
                name='dateSingle'
                rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                initialValue={form.getFieldValue('date')}
              >
                <DatePicker
                  className="w-full datePicker-text-right"
                  suffixIcon={undefined}
                  showTime
                  needConfirm={false}
                  showNow={false}
                  inputReadOnly={isDisable}
                  readOnly={isDisable}
                  allowClear={false}
                  format={DateTimeFormat}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  disabledTime={(current) => {
                    if (current && current.isSame(dayjs(), 'day')) {
                      return {
                        disabledHours: () => [...Array(dayjs().hour() + 1).keys()]
                      };
                    }
                  }}
                />
              </Form.Item>
            )}
          </>
        )}
        {/* Số vé mỗi hóa đơn */}
        <Form.Item
          label={<span className="font-bold">Số vé tối đa mỗi hóa đơn</span>}
          name="maxTicketPerBill"
          initialValue={record?.maxTicketPerBill}
          rules={[{ required: !isDisable, message: "Vui lòng nhập số vé tối đa" }]}
        >
          <InputNumber min={1} controls={false} className="w-full inputNumber-text-right" readOnly={isDisable} />
        </Form.Item>
        {/* Mô tả */}
        <Form.Item
          label={<span className="font-bold">Mô tả</span>}
          name="description"
          initialValue={record?.description}
          rules={[
            { required: forCreate, message: "Vui lòng nhập mô tả!" }
          ]}
        >
          <Input.TextArea className="w-full text-right" minLength={10} autoSize={{ minRows: 1, maxRows: 20 }} readOnly={isDisable} />
        </Form.Item>
        {/* Hình ảnh */}
        <Form.Item
          label={<span className="font-bold">Hình ảnh</span>}
          name="photo"
          className="right-align-photo"
          rules={[{ required: forCreate, message: "Vui lòng chọn hình ảnh!" }]}
        >
          {isDisable ? (
            <Image src={record?.photo} width={200} height={200} />
          ) : (
            <div>
              <Image src={selectedImage ? URL.createObjectURL(selectedImage) : record?.photo} width={200} height={200} />
              <ImgCrop rotationSlider modalClassName="img-crop">
                <Upload
                  beforeUpload={async (file) => {
                    try {
                      const base64String = await fileToBase64(file);
                      setSelectedImage(file);
                      setImgBase64String(base64String);
                    } catch (error) {
                      console.error('Error:', error);
                    }
                    return false;
                  }}
                  showUploadList={false}
                  className="custom-upload"
                  action={null}
                >
                  <Button className="mt-4" icon={<UploadOutlined />}>
                    {selectedImage ? `${selectedImage?.name}` : 'Cập nhật ảnh'}
                  </Button>
                </Upload>
              </ImgCrop>
            </div>
          )}
        </Form.Item>
        {/* Trạng thái */}
        {isDisable && statusList && (
          <div className="flex justify-between text-base">
            <span className="font-bold">Trạng thái: </span>
            {RenderStatus(record?.status)}
          </div>
        )}
      </Form>
      <div className="flex justify-end mt-4">
        {record?.status === 1 && isDisable && (
          <Button
            type="primary"
            loading={loading}
            className="main-button"
            style={{ backgroundColor: "green" }}
            onClick={ActivateType}
          >
            Kích hoạt
          </Button>
        )}
        {!isDisable && (
          <Button type="default"
            onClick={!forCreate ? ResetAll : () => setShowModal(false)}
          >
            Hủy
          </Button>
        )}
        {isDisable ? (
          <Button type="primary" loading={loading} className="nav-button ml-2"
            onClick={() => {
              if (record?.status === 2) {
                message.info("Không thể chỉnh sửa thông tin sự kiện đã diễn ra!");
                return;
              }
              setIsDisable(false)
            }}
          >
            Chỉnh sửa
          </Button>
        ) : (
          <Button type="primary" loading={loading} className="nav-button ml-2"
            onClick={handleSubmitButton}
          >
            Lưu
          </Button>
        )}
      </div>
    </>
  )
}