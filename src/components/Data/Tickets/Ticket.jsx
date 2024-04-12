'use client'
import { Form, Input, InputNumber, DatePicker, Dropdown, Menu, Button, message, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons'
import confirm from "antd/es/modal/confirm";
import { CurrencyDisplay } from '@/src/utils/DisplayHelper';
import { DateFormat, formatDate, dateWithUct } from '@/src/utils/DateFormatter';
import { colorTextDisplay, getItemWithColor, convertStringToNumber } from "@/src/utils/DisplayHelper";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import api from '@/src/app/api/api';
import ApiPath from '@/src/app/api/apiPath';

const statusList = [
  { label: "Kích hoạt" , value: 0, color: "white"},
  { label: "Đã xóa", value: 1, color: "red"}
]

export default function Ticket({
  record,
  ticket,
  getTickets,
  newTicket
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(true);

  const ResetAll = () => {
    form.resetFields();
    setIsDisable(true);
  }

  const RenderStatus = (status) => {
    const {title, color} = getItemWithColor(statusList,status);
    return colorTextDisplay(title, color);
  }

  const UpdateTicket = () => {
    form.validateFields().then(async () => {
      try {
        setLoading(true);
        const params = {
          ticketId: ticket?._id,
        };
        const { ticketName, description, price,  expirationDate, totalAmount } = form.getFieldValue();
        const body = {
          eventId: newTicket ? record?._id : undefined,
          name: ticketName !== "" ? ticketName : undefined,
          description: description !== "" ? description : undefined,
          price: price !== "" ? convertStringToNumber(price) : undefined,
          releaseDate: newTicket ? dateWithUct(dayjs()) : undefined,
          expirationDate: dateWithUct(expirationDate),
          totalAmount: newTicket ? totalAmount : undefined,
          status: newTicket ? 0 : undefined,
        } 
        let res = {}
        if(newTicket) res = await api.post(ApiPath.ADD_TICKET, body);
        else res = await api.patch(ApiPath.UPDATE_TICKET, body, { params });
        if(!!res?.data){  
          await getTickets();
          message.success(res?.message);
        } else {
          message.error(res?.error?.mesage || "Đã có lỗi xảy ra!");
        }
      } catch (error) {
        console.error(error)
        message.error("Đã có lỗi xảy ra!");
      } finally {
        setLoading(false);
      }
    })
  }

  const DeleteTicket = () => {
    return(
      confirm({
        title: "Bạn có muốn xóa vé này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: async () => {
          try {
            setLoading(true);
            const params = {
              ticketId: ticket?._id,
            };
            const body = {} 
            const res = await api.patch(ApiPath.DEACTIVATE_TICKET, body, { params });
            if(!!res?.data){  
              await getTickets();
              message.success(res?.message);
            } else {
              message.error(res?.error?.mesage || "Đã có lỗi xảy ra!");
            }
          } catch (error) {
            console.error(error)
            message.error("Đã có lỗi xảy ra!");
          } finally {
            setLoading(false);
          }
        }
      })
    )
  }

  const ActivateTicket = async() => {
    return(
      confirm({
        title: "Bạn có muốn kích hoạt vé này không?",
        okText: "Có",
        okType: "danger",
        okCancel: true,
        cancelText: "Không",
        onOk: async () => {
          try {
            setLoading(true);
            const params = {
              ticketId: ticket?._id,
            };
            const body = {} 
            const res = await api.patch(ApiPath.ACTIVATE_TICKET, body, { params });
            if(!!res?.data){  
              await getTickets();
              message.success(res?.message);
            } else {
              message.error(res?.error?.mesage || "Đã có lỗi xảy ra!");
            }
          } catch (error) {
            console.error(error)
            message.error("Đã có lỗi xảy ra!");
          } finally {
            setLoading(false);
          }
        }
      })
    )
  }

  const menu = (
    <Menu>
      {isDisable ? (
        <>
          <Menu.Item 
            key="1" 
            icon={<EditOutlined/>} 
            onClick={() => setIsDisable(false)}
            warnKey
          >
            Chỉnh sửa
          </Menu.Item>
          {!newTicket ? (
            <Menu.Item 
              key="2" 
              icon={ticket?.status === 0 ? <DeleteOutlined /> : <TagOutlined />}
              danger
              onClick={ticket?.status === 0 ? DeleteTicket : ActivateTicket}
            >
              {ticket?.status === 0 ? 'Xóa vé' : 'Mở vé'}
            </Menu.Item>
          ) : null}
        </>
      ) : null}
    </Menu>
  );

  useEffect(() => {
    ResetAll();
  }, [ticket]);

  return (
    <Dropdown
      trigger={['contextMenu']}
      overlay={menu}
    >
      <Form 
        form={form}
        layout='vertical'
        className='flex flex-row my-4'
        variant={isDisable ? 'borderless' : 'outlined'}
      >
        <div className='primary-bg w-[60%] p-4 rounded-tl-xl rounded-bl-xl'>
          <Form.Item
            label={<span className='text-white font-bold'>Sự kiện:</span>}
            className='text-justify'
            initialValue={record?.name}
            name='eventName'
          >
            <Input.TextArea className={isDisable ? 'text-white' : ''} readOnly autoSize={{ minRows: 1, maxRows: 3 }}/>
          </Form.Item>
          <Form.Item
            name='ticketName'
            label={<span className='text-white font-bold'>Vé:</span>}
            className='text-justify'
            initialValue={ticket?.name}
            rules={[{ required: !isDisable, message: "Không thể để trống tên vé!"}]}
          >
            <Input className={isDisable ? 'text-white' : ''} readOnly={isDisable} />
          </Form.Item>
          <Form.Item
            name='description'
            initialValue={ticket?.description}
            label={<span className='text-white font-bold'>Mô tả:</span>}
            rules={[{ required: !isDisable, message: "Không thể để trống mô tả!"}]}
          >
            <Input.TextArea className={isDisable ? 'text-white text-justify' : 'text-justify'} readOnly={isDisable} autoSize={{ minRows: 1, maxRows: 4 }} />
          </Form.Item>
          {isDisable && (
          <div className="flex justify-between text-sm">
            <span className="font-bold text-white">Trạng thái: </span>
            {RenderStatus(ticket?.status)}
          </div>
        )}
        </div>
        <div className='primary-bg w-[40%] flex flex-col justify-evenly p-4 rounded-tr-xl rounded-br-xl border-l-2 border-dashed border-gray-200'>
          <Form.Item
            initialValue={CurrencyDisplay(ticket?.price)}
            label={<span className='text-white font-bold'>Giá:</span>}
            name="price"
            rules={[{ required: !isDisable, message: "Không thể để trống giá tiền!"}]}
          >
            <InputNumber
              className={isDisable ? 'w-fit white-price' : 'w-full'}
              readOnly={isDisable}
              controls={false}
              addonAfter={isDisable ? 'VNĐ' : ''}
              formatter={(value) => CurrencyDisplay(value)}
              parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            label={<span className='text-white font-bold'>Phát hành:</span>}
            className='text-justify'
            name='releaseDate'
            initialValue={dayjs(ticket?.releaseDate)}
            style={{pointerEvents: 'none'}}
          >
            <DatePicker
              format={DateFormat}
              readOnly
              allowClear={false}
              suffixIcon={undefined}
              needConfirm={false}
              showNow={false}
              inputReadOnly={true}
              allowEmpty={false}
              className={isDisable ? 'text-white w-full' : ' w-full'}
            />
          </Form.Item>
          <Form.Item
            label={<span className='text-white font-bold'>Hết hạn:</span>}
            className='text-justify'
            name='expirationDate'
            initialValue={dayjs(ticket?.expirationDate)}
            style={{pointerEvents: isDisable ? 'none' : 'auto'}}
            rules={[{ required: !isDisable, message: "Không thể để trống ngày!"}]}
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
              className={isDisable ? 'text-white w-full' : ' w-full'}
              disabledDate={(current) => current && current < dayjs().endOf('day')}
            />
          </Form.Item>
          <Form.Item
            label={<span className='text-white font-bold'>Số lượng phát hành:</span>}
            className='text-justify'
            name='totalAmount'
            initialValue={ticket?.totalAmount}
            rules={[
              { required: !isDisable, message: "Không được để trống số lượng!"},
            ]}
          >
            <InputNumber
              readOnly={isDisable}
              min={1}
              className={isDisable ? 'w-full white-price' : 'w-full'}
            />
          </Form.Item>
          {!isDisable && (
            <div className="flex justify-between mt-4">
              <Button type="text"
                onClick={ResetAll}
              >
                <span className='text-white'>Hủy</span>
              </Button>
              <Button 
                type="text" 
                className="main-button" 
                htmlType='submit'
                onClick={UpdateTicket}
              >
                Lưu
              </Button>
            </div>
          )}
        </div>
      </Form>
    </Dropdown>
  );
}
