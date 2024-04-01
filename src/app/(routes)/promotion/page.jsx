import Layout from "@/src/components/Layout/Base"
import { Promotion } from "@/src/components/Layout/Section"

export const metadata = {
	title: 'TicketPlaza',
	description: 'Hệ thống mua vé sự kiện',
}

export default function PromotionPage(){
	return(
		<Layout noBanner>
			<Promotion/>
		</Layout>
	)
}
