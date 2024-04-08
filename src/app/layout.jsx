import "./global.scss";
import React from "react";
import { UserProvider } from "../context/UserContext";

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <UserProvider>
          <React.Fragment>
            {children}
          </React.Fragment>
        </UserProvider>
      </body>
    </html>
  );
}
