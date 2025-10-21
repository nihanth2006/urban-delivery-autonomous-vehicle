import React, { useState, useEffect } from 'react';
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

const statusPulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
`;

// --- Styled Components ---

const TrackingContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(245, 245, 245, 0.1);
  padding: 15px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 100;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #F5F5F5;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid rgba(245, 245, 245, 0.3);
  color: #F5F5F5;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(245, 245, 245, 0.1);
    border-color: #F5F5F5;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 20px;
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const MapSection = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  min-height: 500px;
`;

const MapPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #B0BEC5;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(245, 245, 245, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245, 245, 245, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    opacity: 0.3;
  }
`;

const MapIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  z-index: 1;
`;

const MapText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  z-index: 1;
`;

const MapSubtext = styled.div`
  font-size: 0.9rem;
  margin-top: 8px;
  opacity: 0.7;
  z-index: 1;
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StatusCard = styled.div`
  background: rgba(34, 197, 94, 0.1);
  border: 2px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
  padding: 25px;
  text-align: center;
  animation: ${statusPulse} 2s infinite;
`;

const StatusTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: #22C55E;
  margin: 0 0 10px 0;
`;

const StatusValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #F5F5F5;
  margin-bottom: 8px;
`;

const StatusSubtext = styled.div`
  font-size: 0.9rem;
  color: #B0BEC5;
`;

const BookingSummary = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 25px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SummaryTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #F5F5F5;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(245, 245, 245, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const SummaryLabel = styled.span`
  font-size: 1rem;
  color: #B0BEC5;
  font-weight: 500;
`;

const SummaryValue = styled.span`
  font-size: 1.1rem;
  color: #F5F5F5;
  font-weight: 600;
`;

const DriverCard = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 25px;
  animation: ${slideIn} 0.6s ease-out;
  text-align: center;
`;

const DriverTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #F5F5F5;
  margin: 0 0 20px 0;
`;

const RobotImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle at center,
      rgba(22, 226, 245, 0.1) 0%,
      rgba(22, 226, 245, 0.05) 30%,
      transparent 70%
    );
    animation: ${pulse} 3s ease-in-out infinite;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(22, 226, 245, 0.1) 25%,
      rgba(22, 226, 245, 0.2) 50%,
      rgba(22, 226, 245, 0.1) 75%,
      transparent 100%
    );
    animation: shine 2s ease-in-out infinite;
    z-index: 2;
  }
  
  @keyframes shine {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

const RobotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  position: relative;
  z-index: 3;
  filter: brightness(1.1) contrast(1.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
    filter: brightness(1.2) contrast(1.2);
  }
`;

const CallButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #22C55E, #16A34A);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
  }

  &:active {
    animation: ${pulse} 0.3s ease;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 2px solid #EF4444;
  color: #EF4444;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: #EF4444;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
  }

  &:active {
    animation: ${pulse} 0.3s ease;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(245, 245, 245, 0.3);
  border-radius: 50%;
  border-top-color: #F5F5F5;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// --- React Component ---

const RideTracking = ({ onNavigateBack, pickupLocation, dropLocation }) => {
  const [routeDetails, setRouteDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Driver Assigned');

  // Robot image source - Autonomous delivery robot in warehouse
  const RobotImageSource = 'https://drive.google.com/file/d/1qImgf4TYg5ZlSn88xS0jlX22z2-ZoJhE/view?usp=sharing';





  // Mock driver data
  const driverData = {
    name: 'Rajesh Kumar',
    rating: '4.8',
    phone: '+91 98765 43210',
    vehicle: 'Honda Activa',
    vehicleNumber: 'KA-01-AB-1234'
  };

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (pickupLocation && dropLocation) {
        setLoading(true);
        try {
          const details = await getRouteDetails(pickupLocation, dropLocation);
          if (details.success) {
            setRouteDetails(details);
          } else {
            setError(details.error);
            // Fallback to mock data
            setRouteDetails({
              distance: 12.5,
              duration: 25,
              startLocation: pickupLocation,
              endLocation: dropLocation
            });
          }
        } catch (err) {
          setError(err.message);
          // Fallback to mock data
          setRouteDetails({
            distance: 12.5,
            duration: 25,
            startLocation: pickupLocation,
            endLocation: dropLocation
          });
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRouteDetails();
  }, [pickupLocation, dropLocation]);

  const handleCallDriver = () => {
    window.open(`tel:${driverData.phone}`);
  };

  const handleCancelRide = () => {
    if (window.confirm('Are you sure you want to cancel this ride?')) {
      console.log('Ride cancelled');
      onNavigateBack();
    }
  };

  return (
    <TrackingContainer>
      <Header>
        <Logo>🚀 Parcel Delivery</Logo>
        <BackButton onClick={onNavigateBack}>
          ← Back to Store
        </BackButton>
      </Header>

      <MainContent>
        <MapSection>
          <MapPlaceholder>
            <MapIcon>🗺️</MapIcon>
            <MapText>Live Tracking Map</MapText>
            <MapSubtext>Real-time location updates</MapSubtext>
          </MapPlaceholder>
        </MapSection>

        <Sidebar>
          <StatusCard>
            <StatusTitle>Current Status</StatusTitle>
            <StatusValue>{currentStatus}</StatusValue>
            <StatusSubtext>Your driver is on the way</StatusSubtext>
          </StatusCard>

          <BookingSummary>
            <SummaryTitle>
              📋 Booking Summary
            </SummaryTitle>
            
            <SummaryItem>
              <SummaryLabel>Pickup Location</SummaryLabel>
              <SummaryValue>{pickupLocation || 'Bangalore'}</SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Drop Location</SummaryLabel>
              <SummaryValue>{dropLocation || 'Vijayawada'}</SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Distance</SummaryLabel>
              <SummaryValue>
                {loading ? <LoadingSpinner /> : 
                 routeDetails ? `${routeDetails.distance.toFixed(1)} km` : 'N/A'}
              </SummaryValue>
            </SummaryItem>
            
            <SummaryItem>
              <SummaryLabel>Estimated Time</SummaryLabel>
              <SummaryValue>
                {loading ? <LoadingSpinner /> : 
                 routeDetails ? `${Math.ceil(routeDetails.duration)} minutes` : 'N/A'}
              </SummaryValue>
            </SummaryItem>
          </BookingSummary>

          <DriverCard>
            <DriverTitle>Your Delivery Robot</DriverTitle>
            
            <RobotImageContainer>
              <RobotImage 
                src={RobotImageSource}
                alt="Autonomous Delivery Vehicle Project Main Image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ 
                display: 'none', 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                borderRadius: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B0BEC5',
                fontSize: '3rem'
              }}>
                🤖
              </div>
            </RobotImageContainer>
            
            <CallButton onClick={handleCallDriver}>
              📞 Call Driver
            </CallButton>
          </DriverCard>

          <CancelButton onClick={handleCancelRide}>
            Cancel Ride
          </CancelButton>
        </Sidebar>
      </MainContent>
    </TrackingContainer>
  );
};

export default RideTracking;
