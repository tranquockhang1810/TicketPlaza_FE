'use client'
import React,{useState, useEffect} from 'react';
import { EventCard, EventCardSkeleton } from '../components/Data/Event';

export default function HomePage() {
	const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = () => {
            // Giả sử loadData() là hàm để lấy dữ liệu, bạn cần thay thế bằng hàm thực sự để lấy dữ liệu từ API
            const loadData = () => {
                setTimeout(() => {
                    const newData = [
                        {
                            name: 'NHỮNG THÀNH PHỐ MƠ MÀNG SUMMER TOUR',
                            type: 'Âm nhạc',
                            time: '18:00',
                            date: '20/05/2023',
                            place: 'SECC Quận 7 - TP.HCM',
                            photos: 'event1.png',
                            views: '3',
                            tickets: [
                                {
                                    _id: '1',
                                    name: 'Vé 1',
                                    price: '20000'
                                },
                                {
                                    _id: '2',
                                    name: 'Vé 2',
                                    price: '100000'
                                },
                                {
                                    _id: '3',
                                    name: 'Vé 3',
                                    price: '50000'
                                },
                            ]
                        },
                        {
                            name: 'GEN FEST 2023',
                            type: 'Âm nhạc',
                            time: '13:00',
                            date: '18/10/2023',
                            place: 'SECC Quận 10 - TP.HCM',
                            photos: 'event2.png',
                            views: '13',
                            tickets: [
                                {
                                    _id: '1',
                                    name: 'Vé 1',
                                    price: '20000'
                                },
                                {
                                    _id: '3',
                                    name: 'Vé 3',
                                    price: '50000'
                                },
                            ]
                        },
                        {
                            name: 'NHỮNG THÀNH PHỐ MƠ MÀNG AUTUMN TOUR',
                            type: 'Âm nhạc',
                            time: '18:00',
                            date: '20/05/2023',
                            place: 'SECC Quận 7 - TP.HCM',
                            photos: 'event3.png',
                            views: '23',
                            tickets: [
                                {
                                    _id: '1',
                                    name: 'Vé 1',
                                    price: '20000'
                                },
                            ]
                        },
                        {
                            name: 'WORKSHOP TRANH HOA',
                            type: 'Nghệ thuật',
                            time: '18:00',
                            date: '20/05/2023',
                            place: 'SECC Quận 7 - TP.HCM',
                            photos: 'event4.png',
                            views: '11',
                            tickets: [
                                {
                                    _id: '1',
                                    name: 'Vé 1',
                                    price: '100000'
                                },
                                {
                                    _id: '2',
                                    name: 'Vé 2',
                                    price: '200000'
                                },
                                {
                                    _id: '3',
                                    name: 'Vé 3',
                                    price: '50000'
                                },
                            ]
                        },
                    ];
                    setData(newData);
                    setLoading(false);
                }, 3000); // 3 giây
            };

            loadData();
        };

        fetchData();
    }, []);

  	return (
        <section>
            <div className='mx-auto p-6'>
                <h1 className='section-header w-full my-2 text-4xl'>
                    SỰ KIỆN HOT
                </h1>
                {loading ? (
                    <div className="flex flex-wrap justify-center">
                        {[...Array(4)].map((_, index) => (
                            <EventCardSkeleton index={index}/>
                        ))}
                    </div>
                ) : (
                <div className='flex flex-wrap justify-center'>
                    {data.map((event, index) => (
                        <EventCard event={event} index={index}/>
                    ))}
                </div>
                )}
                <h4  className='section-header w-full my-2 text-xl hover:cursor-pointer hover:underline'>
                    Xem thêm
                </h4>
            </div>
        </section>
)}