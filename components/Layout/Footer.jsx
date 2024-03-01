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
                        <p className="w-full text-base lg:text-left text-center mt-5 hover:underline hover:cursor-pointer">
                            Mua hàng & Thanh toán
                        </p>
                        <p className="w-full text-base lg:text-left text-center mt-5 hover:underline hover:cursor-pointer">
                            Chính sách & Điều khoản
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
                        <div className="flex justify-center">
                            <FacebookOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
                            <InstagramOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
                            <LinkedinOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
                            <YoutubeOutlined style={{ fontSize: '50px', marginRight: '25px' }}/>
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