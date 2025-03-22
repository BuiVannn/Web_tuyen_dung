import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import JobListing from "../components/JobListing";
import AppDownload from "../components/AppDownload";
import Footer from "../components/Footer";
import AdvancedJobFilter from "../components/AdvancedJobFilter";
import JobMatchIndicator from "../components/JobMatchIndicator";
const Home = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <AdvancedJobFilter />
            {/* <JobMatchIndicator /> */}
            <JobListing />
            <AppDownload />
            <Footer />
        </div>
    )
}

export default Home