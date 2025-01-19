// src/app/components/Header.js
"use client"
import Image from 'next/image';
import styles from './Header.module.css';
import { IoIosMenu } from "react-icons/io";
import styled from 'styled-components';

import { IoIosSearch } from "react-icons/io";

export default function Header() {
    return (
        <header className={styles.header}>
            {/* Left: Logo */}
            <div className={styles.logo}>
                <Image src="/logo2.jpg" alt="Zentlify Logo" width={20} height={20} className='rounded-sm' /><span>entlify</span>
            </div>

            {/* Middle: Search Bar */}
            {/* <div className={styles.searchBar}>
                <input type="text" placeholder="Search in Zentlify..." />
            </div> */}
            <StyledWrapper>
      <div className="input-container">
        <input type="text" name="text" className="input" placeholder="search..." />
        <span className="icon"> 
          <svg width="19px" height="19px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth={0} /><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" /><g id="SVGRepo_iconCarrier"> <path opacity={1} d="M14 5H20" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path opacity={1} d="M14 8H17" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> <path d="M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> <path opacity={1} d="M22 22L20 20" stroke="#000" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /> </g></svg>
        </span>
      </div>
    </StyledWrapper>

            {/* Right: Menu Bar */}
            <div className={styles.menuBar}>
            <IoIosMenu />
            </div>
        </header>
    );
}
const StyledWrapper = styled.div`
  .input-container {
    width: 220px;
    position: relative;
  }

  .icon {
    position: absolute;
    right: 10px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
  }

  .input {
    width: 100%;
    height: 34px;
    padding: 8px;
    transition: .2s linear;
    border: 2.5px solid black;
    border-radius:8px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .input:focus {
    outline: none;
    border: 0.5px solid black;
    box-shadow: -5px -5px 0px black;
  }

  .input-container:hover > .icon {
    animation: anim 1s linear infinite;
  }

  @keyframes anim {
    0%,
    100% {
      transform: translateY(calc(-50% - 5px)) scale(1);
    }

    50% {
      transform: translateY(calc(-50% - 5px)) scale(1.1);
    }
  }
  @media (min-width: 768px) {
    .input-container {
      width: 80vw;
    }
  }`;