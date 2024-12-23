import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "./ImageSlider.css";

const Bestseller = () => {
  // Define the images array directly in the component
  const images = [
    'catagories/Board.jpg', 
    'catagories/Board.jpg', 
    'catagories/Board.jpg',
    'catagories/Board.jpg', 
    'catagories/Board.jpg', 
    'catagories/Board.jpg'
  ];

  return (
    <div>
        <h1>Best Seller</h1>
        <Swiper
      slidesPerView={2.5} // Show 2.5 images in the viewport
      spaceBetween={10} // Space between images
      grabCursor={true} // Enable drag cursor
      freeMode={true} // Smooth, non-snapping scrolling
      className="mySwiper"
    >
      {images.map((src, i) => (
        <SwiperSlide key={i}>
          <div className="product-slide">
            <img
              src={src}
              alt={`Slide ${i}`}
            />
            <div className="product-slide-des">
              <h1>Board Game</h1>
              <h4>599rs</h4>
              <button>View on Amazon</button>
            </div>
          </div>
        </SwiperSlide>
      ))}
      <SwiperSlide>
        <button
          className="swiper-button"
          onClick={() => alert("Redirecting to all products!")}
        >
          View All Products
        </button>
      </SwiperSlide>
    </Swiper>
    </div>
  );
};

export default Bestseller;