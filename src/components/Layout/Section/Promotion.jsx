'use client'
import React from 'react';
import { List, Space } from 'antd';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';

export default function Promotion(){
    return(
        <section>
            <div className='mx-auto p-6'>
                <h1 className='section-header w-full my-2 text-4xl'>
                    KHUYẾN MÃI
                </h1>
                <div className="lg:px-20 flex flex-col lg:flex-row justify-center items-center pt-5 mb-5">
                    <img 
                        src='/images/promotion1.png'
                        alt='pro-banner'
                        className='w-5/6 lg:w-1/2 mb-5 lg:mb-0 lg:mr-12'
                    />
                    <div className='w-5/6 lg:w-1/2 h-full'>
                        <p className='lg:text-xl text base font-istok h-full'>
                            <b>TIỀN NONG KHÔNG PHẢI VẤN ĐỀ <br></br>
                            ĐU MƠ MÀNG ĐÃ CÓ VÍ TRẢ SAU</b> <br></br><br></br>

                            Deal đã mở! Săn ngay cư dân ơi! <br></br>
                            Mừng line-up khủng đổ bộ NTPMM, MoMo yêu thương tặng cư dân thêm voucher giảm giá 100K khi mua vé Những Thành Phố Mơ Màng.<br></br><br></br>

                            Đu NTPMM đơn giản hơn khi Ví Trả Sau giúp cư dân:<br></br>
                            🌱 Mua vé với mức giảm giá ưu đãi<br></br>
                            🌱 Mua hôm nay, tháng sau trả<br></br>
                            🌱 Chủ động vấn đề tài chính<br></br><br></br>

                            🥳 Nhập mã VTSNTPMM2 và thanh toán vé qua Ví Trả Sau MoMo.<br></br>
                            Số lượng giới hạn, nhanh tay nhé bạn ơi!<br></br>
                        </p>
                    </div>
                </div>
                <div className="lg:px-20 flex flex-col lg:flex-row justify-center items-center pt-5 mb-5">
                    <img 
                        src='/images/promotion2.png'
                        alt='pro-banner'
                        className='w-5/6 lg:w-1/2 mb-5 lg:mb-0 lg:mr-12'
                    />
                    <div className='w-5/6 lg:w-1/2 h-full'>
                        <p className='lg:text-xl text base font-istok h-full'>
                            <b>LOA LOA LOA 📣 GENFESTERS CHÚ Ý</b><br></br><br></br>

                            Chỉ còn 1 ngày nữa để bạn có thể tận hưởng những ưu đãi đặc biệt từ Levi's - 
                            nhãn hàng thời trang denim phong cách với Deal độc quyền chỉ dành cho GENfest. Những chiếc voucher siêu xịn trị giá 500K và 200K đang chờ bạn:<br></br><br></br>

                            🔥 GenFan - 2,000 Voucher 500k áp dụng cho sản phẩm quần nguyên giá từ 2 triệu trở lên
                            🔥 GenLove và GenSee - Hơn 17,000 Voucher 200k áp dụng cho các sản phẩm nguyên giá từ 700k trở lên

                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
};
