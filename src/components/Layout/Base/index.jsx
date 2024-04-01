"use client"
import { useRouter } from 'next/navigation';
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";

export default function Layout({ children, noBanner}){
  //const [render, setRender] = useState(true);
  const router = useRouter();

  return(
    <div style={{ position: 'relative', minHeight: "100vh"}}>
      {<Header history={router}/>}
      {!noBanner && <Banner/>}
      {children}
      {<Footer/>}
    </div>
)}