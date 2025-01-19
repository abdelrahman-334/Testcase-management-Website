"use client"

import FeaturesSection from "./featureSection";
import HeroSection from "./hero";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Homepage = ({...props}) => {
    return <div>
        <HeroSection />
        <FeaturesSection />
    </div>
};

export default Homepage;