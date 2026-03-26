"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import PrizePool from "./components/PrizePool";
import CharityImpact from "./components/CharityImpact";
import Pricing from "./components/Pricing";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <PrizePool />
      <CharityImpact />
      <Pricing />
      <Footer />
    </>
  );
}
