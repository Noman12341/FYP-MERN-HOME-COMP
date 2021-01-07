import React from 'react';
// import Banner from '../Components/Banner';
import CarouselBanner from '../Components/CarouselBanner';
import ProductSection from '../Sections/ProductSection';
import AuctionSection from '../Sections/AuctionSection';
import WorkSection from '../Sections/HowItWorkSection';
import AboutUs from '../Sections/AboutUs';
import FinishedAuctionSec from '../Sections/FinishedAuctionSec';

function Home() {
    return <div>
        {/* <Banner /> */}
        <CarouselBanner />
        <ProductSection />
        <AuctionSection />
        <FinishedAuctionSec />
        <WorkSection />
        <AboutUs />
    </div>
}
export default Home;