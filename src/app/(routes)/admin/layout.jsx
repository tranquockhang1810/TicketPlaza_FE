'use client'
import { useUser } from "@/src/context/UserContext"
import { useRouter } from 'next/navigation';
import { Result, Button, Layout } from "antd";
import SideNav from "@/src/components/Common/SideNav";
import Sider from "antd/es/layout/Sider";
import { Content } from "antd/es/layout/layout";

export default function AdminLayout({ children }) {
	const { isAdmin, isSuperAdmin } = useUser();
  const router = useRouter();

  return (
    <>
      {isAdmin() ? (
        <Layout>
					<Sider width={256}>
						<SideNav type={isSuperAdmin() ? "superAdmin" : undefined}/>
					</Sider>

					<Content className="defaut-bg">
            <div className="mx-4 my-2 primary-bg rounded-xl min-h-[95vh]">
						  {children}
            </div>
					</Content>
          
        </Layout>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="Tài khoản của bạn không được phân quyền để truy cập trang này!"
          extra={
            <Button 
              type="primary" 
              className='nav-button h-14'
              onClick={() => router.back()}
            >
              Quay về
            </Button>
          }
        />
      )}
    </>
  )
}