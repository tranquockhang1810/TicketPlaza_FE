// EventCard.jsx
import { Card, Tooltip } from "antd";
import { EnvironmentOutlined, ClockCircleOutlined, TagOutlined, EyeOutlined, DollarCircleOutlined } from '@ant-design/icons';

const getTicketPricesRange = (tickets) => {
    if (tickets.length === 1) {
        return parseFloat(tickets[0].price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    } else {
        const ticketPrices = tickets.map(ticket => parseInt(ticket.price));
        ticketPrices.sort((a, b) => a - b);

        const lowestPrice = parseFloat(ticketPrices[0]).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
        const highestPrice = parseFloat(ticketPrices[ticketPrices.length - 1]).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

        return `${lowestPrice} - ${highestPrice}`;
    }
}

export default function EventCard({ event }) {
    if (!event) return null;

    return (
        <Card
            hoverable
            bordered={false}
            cover={<img className="transition-transform duration-300 transform scale-100 group-hover:scale-110" alt="eventImg" src={`/images/${event.photos}`} />}
            actions={[<span>MUA VÉ NGAY</span>]}
        >
            <Tooltip title={event.name} placement="topLeft" arrow={false}>
                <h1 className='font-bold text-base truncate'>{event.name}</h1>
            </Tooltip>
            <ul className="list-none p-0 text-md">
                <li className="flex justify-start">
                    <TagOutlined />
                    <span className="text-right ml-4">{event.type}</span>
                </li>
                <li className="flex justify-start">
                    <ClockCircleOutlined />
                    <span className="text-right ml-4">{event.time} | {event.date}</span>
                </li>
                <li className="flex justify-start">
                    <EnvironmentOutlined />
                    <span className="text-right ml-4">{event.place}</span>
                </li>
                <li className="flex justify-start">
                    <DollarCircleOutlined />
                    <span className="text-right ml-4">{getTicketPricesRange(event.tickets)}</span>
                </li>
                <li className="flex justify-start">
                    <EyeOutlined />
                    <span className="text-right ml-4">{event.views}</span>
                </li>
            </ul>
        </Card>
    )
}
