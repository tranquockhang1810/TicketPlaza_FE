import Layout from "@/src/components/Layout/Base"

export const metadata = {
	title: 'TicketPlaza',
	description: 'Hệ thống mua vé sự kiện',
}

export default function AboutUs() {
	return (
		<div className='mx-auto p-6'>
			<div className="section-header w-full my-2 text-4xl">
				TICKET PLAZA
			</div>
			<div className="text-center my-4 font-bold secondary-color text-xl">
				HỆ THỐNG MUA VÉ THAM DỰ SỰ KIỆN DÀNH CHO GIỚI TRẺ
			</div>
			<div className="flex justify-center">
				<img src="images/aboutUsImg1.jpg" alt="banner1" width={1200} />
			</div>
			<div className="w-full flex justify-center">
				<p className="text-center my-4 font-bold secondary-color w-4/5 text-lg">
					Ticket Plaza là nền tảng bán vé trực tuyến hàng đầu, nơi kết nối bạn với những sự kiện tuyệt vời nhất. Với sứ mệnh mang lại trải nghiệm mua vé dễ dàng và thuận tiện, chúng tôi luôn nỗ lực không ngừng để đáp ứng mọi nhu cầu của khách hàng.
				</p>
			</div>
			<div className="section-header w-full my-4 text-4xl">
				TẠI SAO NÊN CHỌN TICKET PLAZA?
			</div>
			<div>
				<div className="w-full flex justify-evenly flex-wrap flex-row-reverse">
					<div className="w-[400px] lg:w-1/2 text-justify text-lg items-center lg:mt-20">
						<h1 className="font-bold secondary-color">Đa dạng sự kiện</h1>
						Chúng tôi cung cấp vé cho hàng loạt sự kiện, từ những buổi biểu diễn âm nhạc, lễ hội, thể thao, hội nghị, đến các buổi hòa nhạc quốc tế và các chương trình giải trí đỉnh cao. Dù bạn là ai, Ticket Plaza luôn có sự kiện phù hợp dành cho bạn.
					</div>
					<div className="m-4 flex justify-end">
						<img src='images/aboutUsImg2.jpg' alt="banner2" width={400}></img>
					</div>
				</div>
				<div className="w-full flex justify-evenly flex-wrap flex-row">
					<div className="w-[400px] lg:w-1/2 text-justify text-lg items-center lg:mt-20">
						<h1 className="font-bold secondary-color">Mua vé dễ dàng</h1>
						Với giao diện thân thiện và thao tác đơn giản, bạn có thể dễ dàng tìm kiếm và đặt mua vé chỉ trong vài bước. Hệ thống thanh toán an toàn và nhanh chóng giúp bạn yên tâm mua sắm mà không lo lắng về vấn đề bảo mật.
					</div>
					<div className="m-4 flex justify-end">
						<img src='images/aboutUsImg3.jpg' alt="banner2" width={400}></img>
					</div>
				</div>
				<div className="w-full flex justify-evenly flex-wrap flex-row-reverse">
					<div className="w-[400px] lg:w-1/2 text-justify text-lg items-center lg:mt-28">
						<h1 className="font-bold secondary-color">Ưu đãi đặc biệt</h1>
						Chúng tôi thường xuyên cập nhật các chương trình khuyến mãi và ưu đãi đặc biệt dành cho khách hàng. Hãy theo dõi Ticket Plaza để không bỏ lỡ bất kỳ cơ hội tiết kiệm nào!
					</div>
					<div className="m-4 flex justify-end">
						<img src='images/aboutUsImg4.jpg' alt="banner2" width={400}></img>
					</div>
				</div>
			</div>
			<div className="section-header w-full my-8 text-4xl">
				TẦM NHÌN VÀ SỨ MỆNH
			</div>
			<div className="w-full flex justify-center">
				<p className="text-center mb-4 font-bold secondary-color w-4/5 text-lg">
					Ticket Plaza mong muốn trở thành cầu nối văn hóa và giải trí hàng đầu, đưa mọi người đến gần hơn với những trải nghiệm độc đáo và thú vị. Chúng tôi cam kết không ngừng cải tiến dịch vụ, đem lại giá trị tối ưu cho khách hàng và góp phần vào sự phát triển của ngành giải trí.
				</p>
			</div>
			<div className="flex justify-center">
				<img src="images/aboutUsImg5.jpg" alt="banner1" width={1200} />
			</div>
		</div>
	)
}
