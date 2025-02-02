// src/app/components/Footer.js
import React from 'react'
import { FaFacebookSquare,FaPinterestSquare,FaInstagramSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
  <div className="footer-content">
    <div className="footer-section about">
      <h2>Zentlify</h2>
      <p>Your one-stop shop for the best deals and premium products. Join us and elevate your shopping experience.</p>
    </div>

    <div className="footer-section links">
      <h3>Quick Links</h3>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="about">About Us</a></li>
        <li><a href="products">Products</a></li>
        <li><a href="contact">Contact Us</a></li>
        <li><a href="faq">FAQs</a></li>
      </ul>
    </div>

    <div className="footer-section social">
      <h3>Follow Us</h3>
      <div className="social-icons">
        <a href="#"><FaFacebookSquare /></a>
        <a href="#"><FaInstagramSquare /></a>
        <a href="#"><FaSquareXTwitter /></a>
        <a href="#"><FaPinterestSquare />
        </a>
      </div>
    </div>
  </div>

  <div className="footer-bottom">
    <p>&copy; 2024 Zentlify. All Rights Reserved.</p>
  </div>
</footer>

  )
}

export default Footer
