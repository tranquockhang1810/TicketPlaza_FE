import { useState, useEffect } from "react";
import { Button, Modal, Empty, message } from "antd";
import Ticket from "@/src/components/Data/Tickets/Ticket";
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";

export default function Tab02({
  record,
  showModal
}) {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [visible, setVisible] = useState(false);

  const GetTicket = async () => {
    try {
      setLoading(true);
      const params = {
        limit: 10,
        eventId: record?._id,
      };
      const res = await api.get(ApiPath.GET_TICKETS, { params });
      if(!!res?.data){  
        setTickets(res?.data[0]?.data);
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

  useEffect(()=> {
    GetTicket();
  }, [showModal]);

  const handleAddTicket = () => {
    setVisible(true);
  }

  const handleCancel = () => {
    setVisible(false);
  }

  useEffect(() => {
    handleCancel();
  }, [tickets])

  return (
    <div>
      <div>
        <Button
          className='nav-button w-full mr-4'
          onClick={handleAddTicket}
        >
          Thêm vé mới
        </Button>
      </div>
      <div className='max-h-[77vh] overflow-y-auto mt-2'>
        {tickets.length > 0 ? (
          tickets.map((ticket) => (
            <Ticket
              key={ticket._id}
              ticket={ticket}
              record={record}
              getTickets={GetTicket}
            />
          ))
        ) : (
          <Empty description="Không có vé nào" />
        )}
      </div>

      <Modal
        title="Thêm vé mới"
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Ticket
          record={record}
          ticket={{
            name: "Vé mới",
            description: "Vé mới",
            price: 1000,
            totalAmount: 1
          }}
          getTickets={GetTicket}
          newTicket={true}
        />
      </Modal>
    </div>
  );
}
