import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function useEventsList(){

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const router = useRouter();

    const viewMoreEvents = () => {
        router.push('/events');
    }

    useEffect(() => {
        const fetchData = () => {
            const loadData = () => {
                setTimeout(() => {
                    const newData = [
                        {
                            _id: '1',
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
                            _id: '2',
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
                            _id: '3',
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
                            _id: '4',
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
                }, 3000);
            };
            
            loadData();
        };

        fetchData();
    }, []);

    return { loading, data, viewMoreEvents };
}