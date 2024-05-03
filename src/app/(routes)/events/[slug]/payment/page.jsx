'use client'
import { Steps, ConfigProvider } from 'antd';
import BillCheck from "./Bill";
import { useState } from 'react';

export default function PaymentPage() {
  const [current, setCurrent] = useState(0);
  const items = [
    {
      key: 0,
      title: <span className="font-bold text-xl">XÁC THỰC THÔNG TIN</span>,
      content: <BillCheck current={current} setCurrent={setCurrent}/>
    },
    {
      key: 1,
      title: <span className="font-bold text-xl">THANH TOÁN</span>,
      content: <div>
        Thanh toán
      </div>
    },
  ]

  return (
    <section>
      <div
        className="w-full lg:px-60 py-10"
      >
        <ConfigProvider
          theme={{
            components: {
              Steps: {
                colorPrimary: "#A83131",
                colorText: "#A83131"
              }
            }
          }}
        >
          <Steps
            items={items}
            current={current}
            className="px-4"
          />
        </ConfigProvider>
        <div className="flex justify-center">
          {items[current].content}
        </div>
      </div>
    </section>
  )
}