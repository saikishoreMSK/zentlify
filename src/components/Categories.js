'use client'
import React from "react";
import Link from "next/link";
import "./Components.css";

const Categories = () => {
  const categories = [
    "Home",
    "Dogs",
    "Cats",
    "Tech",
    "Gifts",
    "Cars",
    "Retro",
    "Board",
    "Kids",
    "Decor",
  ];

  return (
    <div>
      <ul className="categories">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/products?category=${category}`}
            passHref
          >
            <li className="category">{category}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
