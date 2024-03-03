'use client'
import React from "react";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined,
    FacebookOutlined, InstagramOutlined, LinkedinOutlined, YoutubeOutlined
} from "@ant-design/icons";

const DATA = {
    email: 'ticketplaza.dev@gmail.com',
    phone: '0123456789',
    address:
        '123 Hai Bà Trưng, phường Bến Nghé, Q1, TP.HCM',
}

export default function Footer(){
    return(
        <footer>
            <div className="bg-footer h-fit flex justify-center">
                <div className="w-11/12 flex flex-wrap justify-between">
                    <div className="footer-block">
                        <img
                            className="lg:mx-0 mx-auto"
                            src="/images/logo.png"
                            alt="logo"
                        />
                        <p className="w-full text-lg lg:text-left text-center mt-5">
                            HỆ THỐNG MUA VÉ THAM DỰ SỰ KIỆN DÀNH CHO GIỚI TRẺ
                        </p>
                        <p className="w-full text-base lg:text-left text-center mt-5 ">
                            <span className="hover:underline hover:cursor-pointer">Mua hàng & Thanh toán</span>
                        </p>
                        <p className="w-full text-base lg:text-left text-center mt-5">
                            <span className="hover:underline hover:cursor-pointer">Chính sách & Điều khoản</span>
                        </p>
                    </div>
                    <div className="footer-block">
                        <h1 className="w-full text-2xl lg:text-left text-center mt-5">
                            Thông tin liên hệ
                        </h1>
                        <div className="text-left flex justify-center lg:justify-normal align-center mt-5">
                            <PhoneOutlined 
                                rotate={90}
                                style={{
                                    fontSize: '25px',
                                    marginRight: '25px'
                                }}
                            />
                            {DATA.phone}
                        </div>
                        <div className="text-left flex justify-center lg:justify-normal align-center mt-5">
                            <MailOutlined 
                                style={{
                                    fontSize: '25px',
                                    marginRight: '25px'
                                }}
                            />
                            {DATA.email}
                        </div>
                        
                        <div className="text-left flex justify-center lg:justify-normal align-center mt-5">
                            <EnvironmentOutlined 
                                style={{
                                    fontSize: '25px',
                                    marginRight: '25px'
                                }}
                            />
                            {DATA.address}
                        </div>
                    </div>
                    <div className="footer-block">
                        <h1 className="w-full text-2xl lg:text-left text-center my-5">
                            Mạng xã hội
                        </h1>
                        <div className="flex lg:justify-start justify-center">
                            <a 
                                href="https://www.facebook.com/tranquockhang1810" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:cursor-pointer hover:text-gray-300"
                            >
                                <FacebookOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
                            </a>
                            <a 
                                href="https://www.instagram.com/tranquockhang1810" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:cursor-pointer hover:text-gray-300"
                            >
                                <InstagramOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
                            </a>
                            <a 
                                href="https://www.linkedin.com/in/tranquockhang1810" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:cursor-pointer hover:text-gray-300"
                            >
                                <LinkedinOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
                            </a>    
                            <a 
                                href="https://www.youtube.com/@tranquockhang1810" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:cursor-pointer hover:text-gray-300"
                            >
                                <YoutubeOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
                            </a>
                        </div>
                    </div>
                    <div className="w-full text-white font-bold text-2xl text-center my-5">
                        © 2024 Bản quyền thuộc về TicketPlaza
                    </div>
                </div>
            </div>
        </footer>
    )
}