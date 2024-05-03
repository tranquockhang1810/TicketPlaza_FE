import "./global.scss";
import React from "react";
import { UserProvider } from "../context/UserContext";
import { TicketProvider } from "../context/BuyTicketsContext";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <UserProvider>
          <TicketProvider>
            <React.Fragment>
              {children}
            </React.Fragment>
          </TicketProvider>
        </UserProvider>
      </body>
    </html>
  );
}
