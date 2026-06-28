'use client'
import React from "react";
import Link from "next/link";
import "./Components.css";

const Categories = () => {
  // Keep in sync with the filter options in products/components/Radio.jsx so
  // every category link actually returns results.
  const categories = ["Home", "Dogs", "Cats", "Tech", "Cars", "Kids", "Gifts"];

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
