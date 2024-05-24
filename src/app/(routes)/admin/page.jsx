'use client'
import { useRouter } from "next/navigation"
import { Spin } from "antd";

export default function Admin() {
  const router = useRouter();
  return (
      <Spin spinning={true} size="large" fullscreen>
        {router.push('/admin/profit')}
      </Spin>
  )
}