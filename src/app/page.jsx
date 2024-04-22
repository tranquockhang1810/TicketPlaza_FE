import Layout from "../components/Layout/Base"
import { EventsSection, Promotion } from "../components/Layout/Section"

export const metadata = {
	title: 'TicketPlaza',
	description: 'Hệ thống mua vé sự kiện',
}

export default function Homepage(){
	return(
			<Layout>
				<EventsSection header={"SỰ KIỆN HOT"}/>
				<Promotion/>
			</Layout>
	)
}
