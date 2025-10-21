// MY_PROJECT/src/App.jsx

import { useState } from 'react'
import './App.css'
import { AuthProvider } from './utils/AuthContext';
import LandingPage from './components/LandingPage';
import AuthenticationPage from './components/AuthenticationPage';
import ECommerceHomePage from './components/ECommerceHomePage';
import DeliveryBooking from './components/DeliveryBooking';
import RideTracking from './components/RideTracking';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import OrdersPage from './components/OrdersPage';
import ProductPage from './components/ProductPage';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [bookingData, setBookingData] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigateToAuth = () => {
    setCurrentPage('auth');
  };

  const navigateToLanding = () => {
    setCurrentPage('landing');
  };

  const navigateToECommerce = () => {
    setCurrentPage('ecommerce');
  };

  const navigateToDelivery = () => {
    setCurrentPage('delivery');
  };

  const navigateToTracking = (data) => {
    setBookingData(data);
    setCurrentPage('tracking');
  };

  const navigateToProfile = () => {
    setCurrentPage('profile');
  };

  const navigateToSettings = () => {
    setCurrentPage('settings');
  };

  const navigateToOrders = () => {
    setCurrentPage('orders');
  };

  const navigateToProduct = (productId) => {
    setSelectedProductId(productId);
    setCurrentPage('product');
  };

  return (
    <AuthProvider>
      {currentPage === 'landing' && (
        <LandingPage onNavigateToAuth={navigateToAuth} onNavigateToECommerce={navigateToECommerce} />
      )}
      {currentPage === 'auth' && (
        <AuthenticationPage onNavigateToLanding={navigateToLanding} onNavigateToECommerce={navigateToECommerce} />
      )}
      {currentPage === 'ecommerce' && (
        <ECommerceHomePage 
          onNavigateToAuth={navigateToAuth} 
          onNavigateToLanding={navigateToLanding} 
          onNavigateToDelivery={navigateToDelivery}
          onNavigateToProfile={navigateToProfile}
          onNavigateToSettings={navigateToSettings}
          onNavigateToOrders={navigateToOrders}
          onNavigateToProduct={navigateToProduct}
        />
      )}
      {currentPage === 'delivery' && (
        <DeliveryBooking onNavigateBack={navigateToECommerce} onNavigateToTracking={navigateToTracking} />
      )}
      {currentPage === 'tracking' && (
        <RideTracking 
          onNavigateBack={navigateToECommerce} 
          pickupLocation={bookingData?.pickupLocation}
          dropLocation={bookingData?.dropLocation}
        />
      )}
      {currentPage === 'profile' && (
        <ProfilePage onNavigateBack={navigateToECommerce} />
      )}
      {currentPage === 'settings' && (
        <SettingsPage onNavigateBack={navigateToECommerce} />
      )}
      {currentPage === 'orders' && (
        <OrdersPage onNavigateBack={navigateToECommerce} />
      )}
      {currentPage === 'product' && (
        <ProductPage 
          productId={selectedProductId}
          onNavigateBack={navigateToECommerce}
        />
      )}
    </AuthProvider>
  )
}

export default App