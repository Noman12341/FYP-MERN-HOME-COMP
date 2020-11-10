import React from 'react';
import Banner from '../Components/Banner';
import ProductSection from '../Sections/ProductSection';
import AuctionSection from '../Sections/AuctionSection';
import WorkSection from '../Sections/HowItWorkSection';
import AboutUs from '../Sections/AboutUs';
import WinsAuction from '../Components/WinsAuction';

function Home() {
    return <div>
        <WinsAuction />
        <Banner />
        <ProductSection />
        <AuctionSection />
        <WorkSection />
        <AboutUs />
    </div>
}
export default Home;