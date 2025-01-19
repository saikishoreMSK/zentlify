"use client"
import React from 'react';
import styled from 'styled-components';

const Radio = ({ onCategoryChange }) => {
  const handleChange = (e) => {
    onCategoryChange(e.target.value);
  };

  return (
    <StyledWrapper>
      <div className="mydict">
        <div>
          <label>
            <input type="radio" name="radio" value="All" defaultChecked onChange={handleChange} />
            <span>All</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Dogs" onChange={handleChange} />
            <span>Dogs</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Cats" onChange={handleChange} />
            <span>Cats</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Home" onChange={handleChange} />
            <span>Home</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Tech" onChange={handleChange} />
            <span>Tech</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Cars" onChange={handleChange} />
            <span>Cars</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Kids" onChange={handleChange} />
            <span>Kids</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Gifts" onChange={handleChange} />
            <span>Gifts</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Trending" onChange={handleChange} />
            <span>Trending</span>
          </label>
          <label>
            <input type="radio" name="radio" value="Best" onChange={handleChange} />
            <span>Best</span>
          </label>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  :focus {
    outline: 0;
    border-color: #2260ff;
    box-shadow: 0 0 0 4px #b5c9fc;
  }

  .mydict div {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.5rem;
    justify-content: center;
    margin-top: 15px;
  }

  .mydict input[type="radio"] {
    clip: rect(0 0 0 0);
    clip-path: inset(100%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  .mydict input[type="radio"]:checked + span {
    box-shadow: 0 0 0 0.0625em #0043ed;
    background-color: #dee7ff;
    z-index: 1;
    color: #0043ed;
  }

  label span {
    display: block;
    cursor: pointer;
    background-color: #fff;
    padding: 0.375em .75em;
    position: relative;
    margin-left: .0625em;
    box-shadow: 0 0 0 0.0625em #b5bfd9;
    letter-spacing: .05em;
    color: #3e4963;
    text-align: center;
    transition: background-color .5s ease;
  }

  label:first-child span {
    border-radius: .375em 0 0 .375em;
  }

  label:last-child span {
    border-radius: 0 .375em .375em 0;
  }`;

export default Radio;
