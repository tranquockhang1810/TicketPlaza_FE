'use client'
import { EventCard, EventCardSkeleton } from '@/src/components/Data/Event';
import BillCard from '@/src/components/Data/Bill/BillComponent';
import { useState, useEffect } from 'react';
import { Spin, message, Empty } from 'antd';
import api from '../../api/api';
import ApiPath from '../../api/apiPath';
import { useUser } from '@/src/context/UserContext';

export default function Bills() {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEmptyData, setIsEmptyData] = useState(true);
  const [data, setData] = useState([]);
  const { user } = useUser();

  const getBillList = async () => {
    try {
      setLoading(true)
      if (!user?.email) return;
      const params = {
        email: user?.email,
        page: page
      }
      const res = await api.get(ApiPath.GET_TRANSACTIONS, { params })
      if (res?.data[0]?.data) {
        const newData = res?.data[0]?.data;
        setData(prevData => {
          if (page > 1 && res?.pagination?.totalPages > 1) {
            return [...prevData, ...newData];
          } else if (newData.length === 0) {
            return prevData;
          } else {
            return newData;
          }
        });
        if (page === 1) {
          setIsEmptyData(newData.length === 0);
        }
        setTotalPages(res?.pagination?.totalPages || 1);
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại");
      }
    } catch (error) {
      console.error(error)
      message.error("Đã có lỗi xảy ra!")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBillList();
  }, [user, page])

  return (
    <Spin spinning={loading} size='large'>
      <section className="mx-auto p-6">
        <div className="section-header w-full my-2 text-4xl">
          LỊCH SỬ VÉ
        </div>
        {isEmptyData ? (
          <Empty
            className='h-[40vh] flex align-center justify-center flex-col'
            description={"Không có dữ liệu!"}
          />
        ) : (
          <div className='flex flex-wrap justify-center'>
            {data.map(bill => (
              <BillCard bill={bill} key={bill?._id} getBillList={getBillList}/>
            ))}
          </div>
        )}
        {!isEmptyData && page <= totalPages && (
          <h4 className='section-header w-full my-2 text-xl'>
            <span
              className='hover:cursor-pointer hover:underline'
              onClick={() => setPage(prevPage => prevPage + 1)}
            >
              Xem thêm
            </span>
          </h4>
        )}
      </section>
    </Spin>
  )
}