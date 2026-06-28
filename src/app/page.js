"use client";
import React, { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { EmblaCarousel } from "@/components/Carousel";
import Categories from "@/components/Categories";
import Bestseller from "@/components/Bestseller";
import Loader from "@/components/Loader";
import ImageSlider from "@/components/ImageSlider";
import Trending from "@/components/Trending";

export default function Home() {
  // Brief branded intro overlay. It sits ON TOP of the content rather than
  // replacing it, so the page (and its data fetches) render immediately —
  // important for LCP and conversions on a revenue site.
  const [intro, setIntro] = useState("loader"); // "loader" | "video" | "done"

  useEffect(() => {
    const t1 = setTimeout(() => setIntro("video"), 1000);
    const t2 = setTimeout(() => setIntro("done"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      {intro !== "done" && (
        <div className="intro-overlay">
          {intro === "loader" ? (
            <Loader />
          ) : (
            <div className="video-container">
              <video
                src="/zentlify-logo.mp4"
                autoPlay
                muted
                className="logo-video"
              />
            </div>
          )}
        </div>
      )}

      <Header />
      <EmblaCarousel />
      <Categories />
      <ImageSlider />
      <Trending />
      <Bestseller />
      <Footer />
    </>
  );
}
