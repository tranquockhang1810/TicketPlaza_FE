'use client'
import { useUser } from "@/src/context/UserContext"
import { useRouter } from 'next/navigation';
import { Result, Button, Layout } from "antd";
import SideNav, { MobileMenu } from "@/src/components/Common/SideNav";
const { Header, Sider, Content } = Layout;

export default function AdminLayout({ children }) {
  const { isAdmin, isSuperAdmin } = useUser();
  const router = useRouter();

  return (
    <>
      {isAdmin() ? (
        <Layout>
          <Header className="lg:hidden block primary-bg relative">
            <MobileMenu type={isSuperAdmin() ? "superAdmin" : undefined} />
          </Header>
          <Layout>
            <Sider width={256} className="sider-menu lg:block hidden">
              <SideNav type={isSuperAdmin() ? "superAdmin" : undefined} />
            </Sider>
            <Content className="defaut-bg">
              <div className="mx-4 my-2 primary-bg rounded-xl min-h-[97vh]">
                {children}
              </div>
            </Content>
          </Layout>
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