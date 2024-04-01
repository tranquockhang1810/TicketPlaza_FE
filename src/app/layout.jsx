import "./global.scss";
import React from "react";
import { UserProvider } from "../context/UserContext";
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_ID}
        >
          <UserProvider>
            <React.Fragment>
              {children}
            </React.Fragment>
          </UserProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
