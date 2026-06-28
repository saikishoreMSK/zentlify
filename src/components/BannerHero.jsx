"use client";
// Homepage promo-banner carousel (admin-managed). Used when banners exist;
// otherwise the home page falls back to the trending product carousel.

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";
import { Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./Components.css";

export default function BannerHero({ banners = [] }) {
  const [emblaRef] = useEmblaCarousel({ loop: banners.length > 1 }, [
    Autoplay({ delay: 4000 }),
  ]);

  if (!banners.length) return null;

  return (
    <Box className="embla" ref={emblaRef} sx={{ mb: 4, overflow: "hidden" }}>
      <div className="embla__container">
        {banners.map((b) => {
          const cta = (
            <Button
              variant="contained"
              color="primary"
              endIcon={<ArrowForwardIcon />}
              sx={{ mt: 2 }}
            >
              Shop Now
            </Button>
          );

          return (
            <div className="embla__slide" key={b.id}>
              <Box className="embla-product-card">
                <Box className="embla-image-container">
                  <Image
                    src={b.image}
                    width={1600}
                    height={700}
                    priority
                    alt={b.headline || "Promotion"}
                  />
                </Box>
                <Box className="embla-details-overlay">
                  {b.headline && (
                    <Typography
                      variant="h3"
                      component="h2"
                      sx={{ mb: 1, fontWeight: 800 }}
                      className="embla-product-title"
                    >
                      {b.headline}
                    </Typography>
                  )}
                  {b.subtext && (
                    <Typography sx={{ mb: 1 }} className="embla-product-title">
                      {b.subtext}
                    </Typography>
                  )}
                  {b.link ? (
                    b.link.startsWith("/") ? (
                      <Link href={b.link}>{cta}</Link>
                    ) : (
                      <a href={b.link} target="_blank" rel="noopener noreferrer">
                        {cta}
                      </a>
                    )
                  ) : (
                    cta
                  )}
                </Box>
              </Box>
            </div>
          );
        })}
      </div>
    </Box>
  );
}
