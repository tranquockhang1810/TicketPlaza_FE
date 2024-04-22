import Layout from "@/src/components/Layout/Base"
import { EventsSection } from "@/src/components/Layout/Section"

export const metadata = {
	title: 'TicketPlaza',
	description: 'Hệ thống mua vé sự kiện',
}

export default function EventsPage(){
	return(
		<Layout noBanner={true}>
			<EventsSection header={"CÁC SỰ KIỆN"} filter={true}/>
		</Layout>
	)
}
