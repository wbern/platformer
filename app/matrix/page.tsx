"use client";
import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

// Keyframes for the typing and blinking cursor effect
const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;
const blinkCaret = keyframes`
  from, to { border-color: transparent }
  50% { border-color: orange; }
`;

// Styled component for the typing text
const TypingText = styled.h1`
  color: white;
  font-family: 'Courier New', monospace;
  font-size: 1.5rem;
  white-space: nowrap;
  overflow: hidden;
  margin: 0 auto;
  letter-spacing: 0.15em;
  width: 25ch;
  position: relative;
  display: inline-block;
`;

const TypingContent = styled.span`
  display: inline-block;
  animation: ${typing} 3.5s steps(40, end) forwards;
  border-right: 0.15em solid orange;
`;

// Styled component for the cursor
const Cursor = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  border-right: 0.15em solid orange;
  height: 100%;
  animation: ${blinkCaret} 0.75s step-end infinite;
`;

// Styled component for the full-page black background
const BlackBackground = styled.div`
  background-color: black;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Home = () => (
  <BlackBackground>
    <TypingText>
      <TypingContent>Welcome to The Matrix</TypingContent>
      <Cursor />
    </TypingText>
  </BlackBackground>
);

export default Home;