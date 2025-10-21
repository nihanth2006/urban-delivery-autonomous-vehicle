import React from 'react';
import styled, { keyframes } from 'styled-components';

// --- Keyframes for Animation ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(0, 123, 255, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(0, 123, 255, 0); }
`;

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  /* Set explicit 100% height and width to fill the space provided by the root reset */
  height: 100vh; /* Full viewport height */
  width: 100vw;  /* Full viewport width */
  position: fixed; /* Fix the container to the viewport */
  top: 0;
  left: 0;
  
  padding: 20px;
  text-align: center;
  
  /* Totally black background */
  background: #000000;
  color: #F5F5F5; /* Light gray color for text */
  overflow: hidden; 
  position: relative; 
  z-index: 10; /* Ensure content appears above global blur effects */
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  animation: ${fadeIn} 1s ease-out;
`;

const CarIcon = styled.span`
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin: 0.5rem 0;
  color: #F5F5F5; /* Light gray text */
`;

const Subtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 300;
  margin: 1.5rem 0 2rem;
  line-height: 1.6;
  max-width: 600px;
  color: #F5F5F5; /* Light gray text */
`;

const Button = styled.button`
  padding: 12px 30px;
  border: 2px solid #F5F5F5; /* Light gray border */
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: transparent; /* Transparent background */
  color: #F5F5F5; /* Light gray text */
  transition: all 0.3s ease;
  
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #F5F5F5; /* Light gray background on hover */
    color: #000000; /* Black text on hover */
    transform: translateY(-2px);
  }
`;

// --- New Styled Components for Chatbot Prompt ---

const ChatbotWrapper = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  z-index: 100; /* Ensure it stays above everything */
`;

const ChatPrompt = styled.span`
  background-color: #F5F5F5; /* Light gray background */
  color: #000000; /* Black text */
  padding: 8px 12px;
  border-radius: 8px;
  margin-right: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 10px rgba(245, 245, 245, 0.3);
  
  /* Simple animation to draw attention */
  animation: ${fadeIn} 0.5s ease-out;
  
  /* Triangle pointing to the chatbot button */
  &::after {
    content: '';
    position: absolute;
    right: 2px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 10px;
    height: 10px;
    background-color: #F5F5F5; /* Light gray triangle */
  }
`;

const ChatButton = styled.div`
  /* This is the round light gray button itself */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #F5F5F5; /* Light gray color */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #000000; /* Black text */
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(245, 245, 245, 0.6);
`;

// --- React Component ---

const LandingPage = ({ onNavigateToAuth, onNavigateToECommerce }) => {
  return (
    <PageContainer>
      <ContentWrapper>
        <CarIcon role="img" aria-label="Delivery Car">
          🚗
        </CarIcon>
        
        <Title>
          PARCEL DELIVERY 
        </Title>
        
        <Subtitle>
          The Future of E-Commerce. Futuristic Products. Autonomous Delivery. Zero Wait Time.
        </Subtitle>
        
        <Button onClick={onNavigateToECommerce}>
          Start Shopping 
          <span style={{ fontSize: '1.2em' }}>→</span> 
        </Button>
      </ContentWrapper>
      
      {/* --- CHATBOT PROMPT ADDED HERE --- */}
      <ChatbotWrapper>
        <ChatPrompt>
            Need help tracking a parcel?
        </ChatPrompt>
        <ChatButton>
            {/* Simple speech bubble icon */}
            💬
        </ChatButton>
      </ChatbotWrapper>
      
    </PageContainer>
  );
};

export default LandingPage;