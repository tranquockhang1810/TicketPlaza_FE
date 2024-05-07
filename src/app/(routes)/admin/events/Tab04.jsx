import api from '@/src/app/api/api';
import ApiPath from '@/src/app/api/apiPath';
import { List, Rate, message } from 'antd';
import { useState, useEffect } from 'react'

export default function Tab04({
  event
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const getFeedbacksList = async () => {
    try {
      setLoading(true)
      const params = {
        page,
        limit,
        eventId: event?._id
      }
      const res = await api.get(ApiPath.GET_FEEDBACKS_LIST, { params })
      if (res?.data[0]?.data) {
        setData(res?.data[0]?.data)
        setTotal(res?.pagination?.totalItems)
        console.log(res?.pagination?.totalItems);
      } else {
        message.error(res?.error?.message);
      }
    } catch (error) {
      console.error(error)
      message.error("Đã có lỗi xảy ra!");
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getFeedbacksList()
  }, [page])

  return (
    <>
      <List
        pagination={{
          pageSize: limit,
          current: page,
          total,
          onChange: handleChangePage,
          align: 'center'
        }}
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={
                <div className='flex justify-between'>
                  <span className='font-bold'>{item?.user?.fullName} </span>
                  <Rate value={item?.rate} disabled />
                </div>
              }
              description={item?.user?.email}
            />
            {item?.context}
          </List.Item>
        )}
      />
    </>
  )
}