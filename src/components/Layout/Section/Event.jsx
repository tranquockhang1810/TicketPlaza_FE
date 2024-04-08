'use client'
import api from '@/src/app/api/api';
import { EventCard, EventCardSkeleton } from '../../Data/Event';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import ApiPath from '@/src/app/api/apiPath';
import { message } from 'antd';
 
export default function EventsSection() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const router = useRouter();
  const path = usePathname();

  const viewMoreEvents = () => {
    if(path === '/events') {
      
      return;
    }
    router.push('/events');
  }

  const getEventTypeList = async () => {
    try {
      setLoading(true);
      const params = {
        page: 1,
        limit: 10000,
        status: 0
      }
      const res = await api.get(ApiPath.GET_EVENT_TYPE_LIST, { params });
      if (!!res?.data) {
        setTypeList(res?.data[0].data);
      } else {
        message.error( res?.error?.message|| "Đã có lỗi xảy ra! Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false)
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const params = { sort: "view", ticket: true, status: 0}
      const res = await api.get(ApiPath.GET_EVENT_LIST, { params });
      if(!!res?.data) {
        setData(res?.data[0].data);
      } else {
        message.error( res?.error?.message|| "Đã có lỗi xảy ra! Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEventTypeList(),
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
            {[...Array(8)].map((_, index) => (
              <EventCardSkeleton key={index}/>
            ))}
          </div>
        ) : (
        <div className='flex flex-wrap justify-center'>
          {data.map((data) => (
            <EventCard event={data?.event} tickets={data?.tickets} typeList={typeList} key={data?.event._id}/>
          ))}
        </div>
        )}
        <h4 
          className='section-header w-full my-2 text-xl'
        >
          <span 
              className='hover:cursor-pointer hover:underline'
              onClick={viewMoreEvents}
          >
              Xem thêm
          </span>
        </h4>
      </div>
    </section>
)}