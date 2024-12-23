'use client'
import React from 'react'
import { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import './Components.css';

export function EmblaCarousel() {
    const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({delay:2000})])
  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container h-full">
        <div className="embla__slide">
            <Image src="/catagories/Board.jpg" width={200} height={100} alt='Board' />

        </div>
        <div className="embla__slide flex items-center justify-center">
        <Image src="/catagories/Cars.jpg" width={200} height={100} alt='Board' />

        </div>
        <div className="embla__slide flex items-center justify-center">
        <Image src="/catagories/Home.jpg" width={200} height={100} alt='Board' />
        </div>
      </div>
    </div>
  )
}
