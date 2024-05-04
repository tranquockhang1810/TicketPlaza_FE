'use client'
import {
  Row,
  Col,
  Card,
  Statistic,
  DatePicker,
  message
} from 'antd';
import { EyeOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import {
  DateFormat,
  MonthFormat,
  formatDate,
  YearFormat
} from '@/src/utils/DateFormatter';
import CountUp from 'react-countup';
import BarChart from '@/src/components/Common/Bar';
import api from '@/src/app/api/api';
import ApiPath from '@/src/app/api/apiPath';
import { useUser } from '@/src/context/UserContext';

export default function Views() {
  const { isSuperAdmin, user } = useUser();
  const [loading, setLoading] = useState(false);
  const [chartLoading, setChartLoading] = useState(false);
  const [totalDay, setTotalDay] = useState(0);
  const [totalMonth, setTotalMonth] = useState(0);
  const [totalYear, setTotalYear] = useState(0);
  const [chartData, setChartData] = useState();
  const [rangeDay, setRangeDay] = useState([dayjs().startOf('year'), dayjs().endOf('year')]);

  const formatter = (value) =>
    <CountUp
      end={value}
    />;

  const handleDateChange = (values) => {
    setRangeDay(values)
  }

  const generateRandomColor = (numColors) => {
    const randomColor = () => Math.floor(Math.random() * 256);
    const colors = [];

    for (let i = 0; i < numColors; i++) {
      const color = `rgba(${randomColor()}, ${randomColor()}, ${randomColor()}, 0.3)`;
      colors.push(color);
    }

    return colors;
  }

  const getChartData = async () => {
    try {
      setChartLoading(true);
      const params = {
        host: isSuperAdmin() ? undefined : user._id,
        member: isSuperAdmin() ? undefined : user._id,
        startDate: formatDate(rangeDay[0]),
        endDate: formatDate(rangeDay[1])
      }
      const res = await api.get(ApiPath.GET_VIEWS, { params });
      if (res?.data) {
        const colors = generateRandomColor(res?.data[0].data.length);
        const data = {
          labels: res?.data[0].data,
          datasets: [
            {
              label: "Lượt xem",
              data: res?.data[0].viewList,
              backgroundColor: colors,
              hoverOffset: 4
            }
          ]
        }
        setChartData(data);
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setChartLoading(false);
    }
  }

  useEffect(() => {
    getChartData();
  }, [rangeDay])

  return (
    <>
      <div className='p-4'>
        <Card
          className='max-h-[90vh] pt-4 overflow-y-auto'
          loading={chartLoading}
          title={
            <div className='flex justify-between'>
              <div className='font-bold text-2xl'>BIỂU ĐỒ LƯỢT QUAN TÂM</div>
              <div>
                <span className='mr-4'>Thời gian diễn ra sự kiện:</span>
                <DatePicker.RangePicker
                  value={rangeDay}
                  onChange={handleDateChange}
                  format={DateFormat}
                  allowClear={false}
                />
              </div>
            </div>
          }
        >
          {chartData &&
            <BarChart
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
              }}
              data={chartData}
            />
          }
        </Card>
      </div>
    </>
  )
}
