'use client'
import { useState, useEffect } from "react";
import { message, Divider, Spin, Collapse, ConfigProvider, Button, InputNumber, Form, Empty } from 'antd'
import { EnvironmentOutlined, ClockCircleOutlined, TagOutlined, EyeOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { formatRangeDate } from "@/src/utils/DateFormatter";
import Ticket from "@/src/components/Data/Tickets/Ticket";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { useUser } from "@/src/context/UserContext";
import { useTicket } from "@/src/context/BuyTicketsContext";
import { EventsSection } from "@/src/components/Layout/Section";
import { useRouter, usePathname } from "next/navigation";

export default function Page({ params: slParams }) {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState();
  const [form] = Form.useForm();
  const { onBuyTickets, tickets } = useTicket();
  const { isAuthenticated } = useUser()
  const router = useRouter();
  const currentPath = usePathname();

  const getEventDetail = async () => {
    try {
      setLoading(true);
      const params = {
        eventId: slParams.slug
      }
      const updateViewRes = await api.patch(ApiPath.UPDATE_VIEW, {}, { params })
      if (updateViewRes?.data[0]?.data.length === 0) return;
      const res = await api.get(ApiPath.GET_EVENT_DETAIL, { params });
      if (res?.data[0]?.data) {
        setEvent(res?.data[0]?.data);
      } else {
        message.error(res?.error?.mesage || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra");
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if ((e.keyCode < 48 || e.keyCode > 57) && e.keyCode !== 8) {
      e.preventDefault();
    }
  };

  const handleBuyTickets = () => {
    if (!isAuthenticated()) {
      message.error("Vui lòng đăng nhập trước khi mua vé!");
      router.push(`/login?order=${slParams.slug}`);
      return;
    }
    try {
      let totalTickets = 0;
      const tickets = event?.tickets.map((ticket, index) => {
        const quantity = form.getFieldValue(index);
        totalTickets += quantity || 0;
        return quantity > 0 ? {
          ticketId: ticket._id,
          name: ticket.name,
          amount: quantity,
          price: ticket.price
        } : null;
      }).filter(ticket => ticket !== null);

      if (totalTickets === 0) {
        message.error(`Bạn chưa chọn số lượng vé muốn mua!`);
        return;
      }

      if (totalTickets > event?.maxTicketPerBill) {
        message.error(`Tổng số lượng vé không được vượt quá ${event?.maxTicketPerBill}.`);
        return;
      }
      onBuyTickets(tickets, {
        eventID: event._id,
        name: event?.name,
        date: formatRangeDate(null, event)
      });
      router.push(`${currentPath}/payment`)
    } catch (error) {
      console.error(error);
    }
  };

  const getTicketAmount = (ticketId) => {
    const founderTicket = tickets.find((ticket) => ticket?.ticketId === ticketId);
    return founderTicket?.amount || undefined;
  }

  const items = [
    {
      key: '1',
      label: <h1 className='w-full font-bold text-xl'>
        MÔ TẢ
      </h1>,
      children: <p className="text-justify">{event?.description}</p>,
    },
    {
      key: '2',
      label: <h1 className='w-full font-bold text-xl'>
        VÉ
      </h1>,
      children: (
        <Form form={form}>
          <div className="flex flex-wrap justify-between">
            {event?.tickets.map((ticket, index) => (
              <div>
                <Ticket
                  record={event}
                  ticket={ticket}
                  client={true}
                />
                <Form.Item
                  key={index}
                  name={index}
                  label={<span className="font-bold text-lg">Số lượng muốn mua</span>}
                  className="flex justify-center"
                  initialValue={getTicketAmount(ticket._id) || 0}
                >
                  <InputNumber
                    min={0}
                    max={ticket?.totalAmount}
                    onKeyDown={handleKeyPress}
                  />
                </Form.Item>
              </div>
            ))}
          </div>
          {event?.tickets.length > 0 ? (
            <Form.Item className="w-full">
              <Button
                className="nav-button w-full h-12"
                onClick={handleBuyTickets}
              >
                MUA VÉ NGAY
              </Button>
            </Form.Item>
          ) : (
            <Empty description={"Sự kiện hiện chưa mở bán vé!"} />
          )}

        </Form>
      ),
    },
  ];

  useEffect(() => {
    getEventDetail();
  }, []);

  return (
    <section>
      <Spin spinning={loading} size="large">
        <div className="mx-auto p-6">
          <div className="w-full px-20 flex flex-wrap justify-center">
            <div className="mb-4 mx-4">
              <img src={event?.photo} width={500} />
            </div>
            <div className="mx-4 max-h-[500px] w-[500px] flex flex-col justify-center items-start text-white font-bold primary-bg rounded-xl">
              <h1 className='text-white w-full md:text-3xl text-base text-center pt-4'>
                {event?.name}
              </h1>
              <div className="w-full flex justify-center">
                <div className="w-1/2">
                  <Divider className="border-white" dashed />
                </div>
              </div>
              <ul className="list-none pl-8">
                <li className="flex justify-start md:mb-8 mb-4">
                  <TagOutlined />
                  <span className="text-left ml-4 font-istok text-base md:text-xl">{event?.type}</span>
                </li>
                <li className="flex justify-start md:mb-8 mb-4">
                  <ClockCircleOutlined />
                  <span className="text-left ml-4 font-istok text-base md:text-xl">{formatRangeDate(null, event)}</span>
                </li>
                <li className="flex justify-start md:mb-8 mb-4">
                  <EnvironmentOutlined />
                  <span className="text-left ml-4 font-istok text-base md:text-xl">{event?.place}</span>
                </li>
                <li className="flex justify-start md:mb-8 mb-4">
                  <EyeOutlined />
                  <span className="text-left ml-4 font-istok text-base md:text-xl">{event?.views}</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full px-24 mt-4 flex flex-wrap justify-center">
            <ConfigProvider
              theme={{
                components: {
                  Collapse: {
                    colorTextHeading: "white",
                    headerBg: "#6E1010"
                  }
                }
              }}
            >
              <Collapse items={items} defaultActiveKey={2} size="large" className="w-[500px] xl:w-4/5 2xl:w-3/4 collapse-center-icon" />
            </ConfigProvider>
          </div>
        </div>
        <EventsSection header={"SỰ KIỆN TƯƠNG TỰ"} limit={4} />
      </Spin>
    </section>
  )
}