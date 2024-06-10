'use client'
import api from "@/src/app/api/api";
import ApiPath from "@/src/app/api/apiPath";
import { Spin, message } from "antd";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckIn() {
  const [loading, setLoading] = useState(false);
  const eventId = useSearchParams().get("eventId");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('reader', {
      qrbox: {
        width: 800,
        height: 800,
      },
      fps: 5,
    });

    scanner.render(success, error);

    async function success(result) {
      try {
        setLoading(true);
        const params = {
          billId: result,
          eventId: eventId
        }
        const res = await api.patch(ApiPath.CHECKIN_BILL, {}, { params });
        if(res?.data[0].status !== "fail") {
          message.success(res?.message);
        } else 
        message.error(res?.message || "Mã hóa đơn không hợp lệ!");
        setTimeout(null, 3000);
      } catch (error) {
        console.error(error);
        message.error("Đã có lỗi xảy ra! Vui lòng thử lại!")
      } finally {
        setLoading(false);
      }
    }
    function error(err) {
      setTimeout(() => {
        console.error(err);
      }, 10000)
    }
  }, []);

  return (
    <Spin spinning={loading} size="large">
      <div className="h-[97vh] flex items-center justify-center">
        <div className="mx-4 bg-white rounded-xl w-full h-[90vh] flex items-center justify-center">
          <div id='reader' className="bg-white w-[60%]"></div>
        </div>
      </div>
    </Spin>
  )
}