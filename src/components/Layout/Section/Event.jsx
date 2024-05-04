'use client'
import api from '@/src/app/api/api';
import { EventCard, EventCardSkeleton } from '../../Data/Event';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import ApiPath from '@/src/app/api/apiPath';
import { message, Form, Row, Col, Input, Select, DatePicker, Empty } from 'antd';
import dayjs from 'dayjs';

export default function EventsSection({ header, filter, limit }) {
  const [updatedHeader, setUpdatedHeader] = useState(header);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState("");
  const [dateRange, setDateRange] = useState([dayjs().startOf('year'), dayjs().endOf('year')]);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [sort, setSort] = useState("view");

  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const [form] = Form.useForm();

  const viewMoreEvents = (event) => {
    event.preventDefault();
    if (path === '/events') {
      setCurrentPage(prevPage => prevPage + 1);
    } else router.push('/events');
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
        message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
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
      const keyword = searchParams.get('keyword');
      const { type, date } = form.getFieldValue();
      const params = {
        type: type !== "" ? type : undefined,
        startDate: date ? date[0].format("M/D/YYYY") : dateRange[0].format("M/D/YYYY"),
        endDate: date ? date[1].format("M/D/YYYY") : dateRange[1].format("M/D/YYYY"),
        page: currentPage,
        sort: sort,
        ticket: true,
        limit: limit || 8,
        status: 0,
        name: keyword !== "" ? keyword : undefined,
      }
      const res = await api.get(ApiPath.GET_EVENT_LIST, { params });
      if (res?.data[0]?.data) {
        let newData = res?.data[0].data;
        if (currentPage > 1) {
          setData(prevData => [...prevData, ...newData]);
        } else {
          setData(newData);
        }
        setTotalPages(res?.data[0].totalPages || 1);
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const paymentMessage = searchParams.get("paymentMessage");
    if (paymentMessage) {
      message.success(paymentMessage);
      router.push('/events');
    }
  }, [])

  useEffect(() => {
    getEventTypeList();
    fetchData();
  }, [currentPage, type, dateRange, path, searchParams, sort]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const keywordFromURL = urlParams.get('keyword');
    if (keywordFromURL) {
      setUpdatedHeader(`${header} - TỪ KHÓA: ${keywordFromURL.toUpperCase()}`);
    } else {
      setUpdatedHeader(header);
    }
  }, [header, searchParams]);

  useEffect(() => {
    setIsEmptyData(data.length === 0);
  }, [data]);

  const handleTypeChange = (value) => {
    setType(value);
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  return (
    <section>
      <div className='mx-auto p-6'>
        <h1 className='section-header w-full my-2 text-4xl'>
          {updatedHeader}
        </h1>
        {filter && (
          <Form
            form={form}
            layout="horizontal"
            className='mt-8'
          >
            <Row gutter={12} className="flex justify-evenly">
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
                <Form.Item
                  name="type"
                  label={<span className="font-bold secondary-color text-xl">Thể loại</span>}
                  initialValue={type}
                >
                  <Select
                    options={[
                      { label: "Tất cả", value: "" },
                      ...typeList.map((type) => ({
                        label: type.eventTypeName,
                        value: type.typeId
                      }))
                    ]}
                    onChange={handleTypeChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
                <Form.Item
                  name="date"
                  label={<span className="secondary-color font-bold text-xl">Thời gian</span>}
                >
                  <DatePicker.RangePicker
                    className="w-full"
                    defaultValue={dateRange}
                    format="DD/MM/YYYY"
                    allowClear={false}
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} xxl={{ span: 6 }}>
                <Form.Item
                  name="sortType"
                  label={<span className="font-bold secondary-color text-xl">Xếp theo</span>}
                  initialValue={sort}
                >
                  <Select
                    options={[
                      { label: "Lượt xem", value: "view" },
                      { label: "Ngày diễn ra", value: ""}
                    ]}
                    onChange={(value) => setSort(value)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        )}

        {loading ? (
          // Nếu đang loading thì hiển thị loading indicator
          <div className="flex flex-wrap justify-center">
            {[...Array(8)].map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          isEmptyData ? (
            <Empty
              className='h-[40vh] flex align-center justify-center flex-col'
              description={"Không có dữ liệu!"}
            />
          ) : (
            <div className='flex flex-wrap justify-center'>
              {data.map((data) => (
                <EventCard event={data?.event} tickets={data?.tickets} typeList={typeList} key={data?.event._id} />
              ))}
            </div>
          )
        )}

        {!isEmptyData && currentPage <= totalPages && (
          <h4 className='section-header w-full my-2 text-xl'>
            <span
              className='hover:cursor-pointer hover:underline'
              onClick={viewMoreEvents}
            >
              Xem thêm
            </span>
          </h4>
        )}
      </div>
    </section>
  )
}