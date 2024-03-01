import "./global.scss";
import React from "react";
import Layout from '../components/Layout'

export const metadata = {
  title: 'TicketPlaza',
  description: 'Hệ thống mua vé sự kiện',
}

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <React.Fragment>
          <Layout>
            {children}
          </Layout>
        </React.Fragment>
      </body>
    </html>
  );
}
