import React from "react";
import Navbar from "../components/navbar";
import Hero from "../components/Hero";
import Highlights from "../components/Highlights";
import FeaturedProducts from "../components/FeaturedProducts";
import CustomerReviews from "../components/CustomerReviews";
import Footer from "../components/Footer";

/**
 * HomePage Component
 * Main landing page with hero, highlights, and featured products
 */
const HomePage = () => {
  return (
    <>
      <Hero />
      <Highlights />
      <FeaturedProducts />
      <CustomerReviews />
    </>
  );
};

export default HomePage;
