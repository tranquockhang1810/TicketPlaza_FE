'use client'
import { useRouter } from "next/navigation"
import { Spin } from "antd";

export default function Admin() {
  const router = useRouter();
  return (
    <Spin spinning={true}>
      {router.push('/admin/profit')}
    </Spin>
  )
}