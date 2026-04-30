import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Listings from "./components/Listings";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Process from "./components/Process";
import FAQs from "./components/FAQs";
import Footer from "./components/Footer";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetail from "./pages/PropertyDetail";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Listings />
      <Features />
      <Testimonials />
      <Process />
      <FAQs />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<ListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
