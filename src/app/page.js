"use client"
import localFont from "next/font/local";
import "./globals.css";
import React, { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { EmblaCarousel } from "@/components/Carousel";
import Categories from "@/components/Categories";
import Bestseller from "@/components/Bestseller";
import CategoryImg from "@/components/CategoryImg";
import Loader from "@/components/Loader";
import ImageSlider from "@/components/ImageSlider";
import Trending from "@/components/Trending";
export default function Home({ children }) {
  const [showLoader, setShowLoader] = useState(true);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Timer for loader (5 seconds)
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
      setShowVideo(true); // Show video after loader
    }, 4000); // 5 seconds for loader

    return () => clearTimeout(loaderTimer); // Cleanup loader timer
  }, []);
  useEffect(() => {
    if (showVideo) {
      // Timer for video (e.g., 3 seconds)
      const videoTimer = setTimeout(() => {
        setShowVideo(false); // Hide video after playback
      }, 3000); // Adjust the duration to match the video length

      return () => clearTimeout(videoTimer); // Cleanup video timer
    }
  }, [showVideo]);
  return (
    <html lang="en">
      <body>
      {showLoader ? (
        <Loader />
      ) : showVideo ? (
        <div className="video-container">
          <video
            src="/zentlify-logo.mp4" // Replace with the actual path
            autoPlay
            muted
            className="logo-video"
          />
        </div>
      ) : (
        <>
          <Header />
          <EmblaCarousel />
          <Categories />
          <ImageSlider/>
          <Trending/>
          <Bestseller />
          <CategoryImg />
          <Navbar />
          {children}
          <Footer />
        </>
      )}
    </body>
    </html>
  );
}
