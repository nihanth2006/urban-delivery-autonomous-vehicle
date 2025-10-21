import React, { useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { getRouteDetails } from '../utils/routeService';

// --- Keyframes for Animation ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// --- Styled Components ---

const BookingContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;


const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BookingCard = styled.div`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(245, 245, 245, 0.2);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #16E2F5, transparent, #16E2F5);
    border-radius: 22px;
    z-index: -1;
    opacity: 0.3;
    animation: borderGlow 2s ease-in-out infinite;
  }
  
  @keyframes borderGlow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  color: #F5F5F5;
  background: linear-gradient(45deg, #F5F5F5, #B0BEC5);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #B0BEC5;
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #F5F5F5;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MapPinIcon = styled.span`
  font-size: 1.2rem;
  color: #FF69B4;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid rgba(245, 245, 245, 0.2);
  border-radius: 12px;
  background: rgba(245, 245, 245, 0.05);
  color: #F5F5F5;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #FFD700;
    background: rgba(245, 245, 245, 0.1);
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }

  &::placeholder {
    color: #B0BEC5;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #FF8C00;
  font-size: 1.2rem;
  z-index: 1;
`;

const DistanceDisplay = styled.div`
  background: rgba(255, 140, 0, 0.2);
  border: 1px solid rgba(255, 140, 0, 0.4);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin: 20px 0;
  animation: ${slideIn} 0.6s ease-out;
`;

const DistanceTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #FFA500;
  margin: 0 0 10px 0;
`;

const DistanceValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #F5F5F5;
  margin-bottom: 5px;
`;

const DistanceDetails = styled.p`
  font-size: 0.9rem;
  color: #B0BEC5;
  margin: 0;
`;

const BookRideButton = styled.button`
  width: 100%;
  padding: 20px;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  color: #000000;
  border: none;
  border-radius: 15px;
  font-size: 1.3rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
  box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(255, 215, 0, 0.4);
    background: linear-gradient(45deg, #FFA500, #FFD700);
  }

  &:active {
    animation: ${pulse} 0.3s ease;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(245, 245, 245, 0.3);
  color: #F5F5F5;
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(245, 245, 245, 0.1);
    border-color: #F5F5F5;
  }
`;

// --- React Component ---

const DeliveryBooking = ({ onNavigateBack, onNavigateToTracking }) => {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [distance, setDistance] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleLocationChange = useCallback(async () => {
    if (pickupLocation && dropLocation) {
      setIsCalculating(true);
      try {
        const routeResult = await getRouteDetails(pickupLocation, dropLocation);
        if (routeResult.success) {
          setDistance({
            distance: routeResult.distance,
            duration: routeResult.duration
          });
        } else {
          console.error('Route calculation failed:', routeResult.error);
          setDistance(null);
        }
      } catch (error) {
        console.error('Error calculating route:', error);
        setDistance(null);
      } finally {
        setIsCalculating(false);
      }
    } else {
      setDistance(null);
    }
  }, [pickupLocation, dropLocation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pickupLocation && dropLocation && distance) {
      console.log('Booking delivery:', { pickupLocation, dropLocation, distance });
      // Navigate to tracking page with booking data
      onNavigateToTracking({
        pickupLocation,
        dropLocation,
        distance: distance.distance,
        duration: distance.duration
      });
    }
  };

  // Calculate distance when both locations are entered
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleLocationChange();
    }, 1000); // Debounce the calculation

    return () => clearTimeout(timeoutId);
  }, [pickupLocation, dropLocation, handleLocationChange]);

  return (
    <BookingContainer>
      <BackButton onClick={onNavigateBack}>
        ← Back to Store
      </BackButton>

      <ContentWrapper>
        <BookingCard>
          <Header>
            <Title>Book Your Delivery</Title>
            <Subtitle>Enter pickup and drop locations to get started</Subtitle>
          </Header>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label>
                <MapPinIcon>📍</MapPinIcon>
                Pickup Location
              </Label>
              <Input
                type="text"
                placeholder="Enter pickup address or city"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                required
              />
            </InputGroup>

            <InputGroup>
              <Label>
                <MapPinIcon>📍</MapPinIcon>
                Drop Location
              </Label>
              <Input
                type="text"
                placeholder="Enter drop address or city"
                value={dropLocation}
                onChange={(e) => setDropLocation(e.target.value)}
                required
              />
            </InputGroup>

            {(isCalculating || distance) && (
              <DistanceDisplay>
                <DistanceTitle>Estimated Distance</DistanceTitle>
                <DistanceValue>
                  {isCalculating ? 'Calculating...' : distance ? `${distance.distance.toFixed(1)} km` : 'Unable to calculate'}
                </DistanceValue>
                <DistanceDetails>
                  {isCalculating 
                    ? 'Finding the best route...' 
                    : distance 
                      ? `Approximate delivery time: ${Math.ceil(distance.duration)} minutes`
                      : 'Could not find a route between these locations'
                  }
                </DistanceDetails>
              </DistanceDisplay>
            )}

            <BookRideButton 
              type="submit" 
              disabled={!pickupLocation || !dropLocation || isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Book Ride'}
            </BookRideButton>
          </Form>
        </BookingCard>
      </ContentWrapper>
    </BookingContainer>
  );
};

export default DeliveryBooking;
