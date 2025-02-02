import React from "react";
import Link from "next/link";
import "./Components.css"; // Add a CSS file for styling

const Trending = () => {
  const data = [
    { id: 1, src: "catagories/Board.jpg", Name: "Board" },
    { id: 2, src: "catagories/Cars.jpg", Name: "Cars" },
    { id: 3, src: "catagories/Dogs.jpg", Name: "Dogs" },
    { id: 4, src: "catagories/Home.jpg", Name: "Home" },
  ];

  return (
    <div className="Trending-Component">
      <h1>Top Collections</h1>
      <div className="trending">
        {data.map((item) => (
          <Link href="/products" key={item.id} passHref>
            <div className="trending-card">
              <img src={item.src} alt={item.Name} />
              <h1 className="trending-title">{item.Name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Trending;
