"use client"
import { useRouter, useState } from 'next/router';
import Header from "./Header";
import Banner from "./Banner";
import Footer from "./Footer";

export default function Layout({ children, noBanner}){
    //const [render, setRender] = useState(true);

    return(
        <div style={{ position: 'relative', minHeight: "100vh"}}>
            {<Header/>}
            {!noBanner && <Banner/>}
            {children}
            {<Footer/>}
        </div>
)}