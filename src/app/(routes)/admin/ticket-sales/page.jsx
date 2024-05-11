'use client'
import {
  Row,
  Col,
  Card,
  Statistic,
  DatePicker,
  message
} from 'antd';
import { TagOutlined } from '@ant-design/icons'
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
  const [rangeDay, setRangeDay] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 1000);

  const formatter = (value) =>
    <CountUp
      end={value}
    />;

  const handleResize = () => {
    setIsSmallScreen(window.innerWidth < 1000);
  };

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

  const getTotalFromArray = (profit) => {
    const totalProfit = profit.reduce((acc, curr) => acc + curr, 0);
    return totalProfit;
  }

  const DataByDate = async (params, type) => {
    try {
      setLoading(true);
      const res = await api.get(ApiPath.GET_TICKET_SALES, { params });
      if (res?.data) {
        const profit = getTotalFromArray(res?.data[0].amountOfTicketList);
        switch (type) {
          case "day":
            setTotalDay(profit);
            break;
          case "month":
            setTotalMonth(profit);
            break;
          case "year":
            setTotalYear(profit);
            break;
          default:
            break;
        }
      } else {
        message.error(res?.error?.message || "Đã có lỗi xảy ra! Vui lòng thử lại!");
      }
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false)
    }
  }

  const getTotal = async () => {
    try {
      setLoading(true);
      const paramsByDay = {
        host: isSuperAdmin() ? undefined : user._id,
        member: isSuperAdmin() ? undefined : user._id,
        startDate: formatDate(dayjs().startOf('date')),
        endDate: formatDate(dayjs().endOf('date'))
      }
      const paramsByMonth = {
        host: isSuperAdmin() ? undefined : user._id,
        member: isSuperAdmin() ? undefined : user._id,
        startDate: formatDate(rangeDay[0].startOf('month')),
        endDate: formatDate(rangeDay[1].endOf('month'))
      }
      const paramsByYear = {
        host: isSuperAdmin() ? undefined : user._id,
        member: isSuperAdmin() ? undefined : user._id,
        startDate: formatDate(rangeDay[0].startOf('year')),
        endDate: formatDate(rangeDay[1].endOf('year'))
      }
      await DataByDate(paramsByDay, 'day');
      await DataByDate(paramsByMonth, 'month');
      await DataByDate(paramsByYear, 'year');
    } catch (error) {
      console.error(error);
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
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
      const res = await api.get(ApiPath.GET_TICKET_SALES, { params });
      if (res?.data) {
        const colors = generateRandomColor(res?.data[0].eventNameList.length);
        const data = {
          labels: res?.data[0].eventNameList,
          datasets: [
            {
              label: "SL Vé",
              data: res?.data[0].amountOfTicketList,
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
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    getChartData();
  }, [rangeDay])

  return (
    <>
      <div className='flex flex-wrap justify-between w-full'>
        <Card bordered={false} className='m-4 lg:w-[29%] w-full' loading={loading}>
          <Statistic
            title={`Lượng vé tiêu thụ theo ngày: ${formatDate(dayjs(), DateFormat)}`}
            value={totalDay}
            valueStyle={{
              color: '#3f8600',
            }}
            prefix={<TagOutlined />}
            formatter={formatter}
          />
        </Card>
        <Card bordered={false} className='m-4 lg:w-[29%] w-full' loading={loading}>
          <Statistic
            title={`Lượng vé tiêu thụ theo tháng: ${formatDate(dayjs(), MonthFormat)}`}
            value={totalMonth}
            valueStyle={{
              color: '#3f8600',
            }}
            prefix={<TagOutlined />}
            formatter={formatter}
          />
        </Card>
        <Card bordered={false} className='m-4 lg:w-[29%] w-full' loading={loading}>
          <Statistic
            title={`Lượng vé tiêu thụ theo năm: ${formatDate(dayjs(), YearFormat)}`}
            value={totalYear}
            valueStyle={{
              color: '#3f8600',
            }}
            prefix={<TagOutlined />}
            formatter={formatter}
          />
        </Card>
      </div>
      <div className='mx-4'>
        <Card
          className='max-h-[75vh] overflow-y-auto'
          loading={chartLoading}
          title={
            <div className='flex justify-between flex-wrap'>
              <div className='font-bold text-2xl md:text-base my-2'>BIỂU ĐỒ LƯỢNG VÉ TIÊU THỤ</div>
              <DatePicker.RangePicker
                value={rangeDay}
                onChange={handleDateChange}
                format={DateFormat}
                allowClear={false}
                className='my-2'
              />
            </div>
          }
        >
          {chartData &&
            <BarChart
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                },
                indexAxis: isSmallScreen ? 'y' : 'x'
              }}
              data={chartData}
            />
          }
        </Card>
      </div>
    </>
  )
}
