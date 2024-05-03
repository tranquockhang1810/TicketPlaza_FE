import Layout from "@/src/components/Layout/Base"

export const metadata = {
	title: 'TicketPlaza',
	description: 'Hệ thống mua vé sự kiện',
}

export default function EventPageLayout({children}){
	return(
		<Layout noBanner={true}>
			{children}
		</Layout>
	)
}