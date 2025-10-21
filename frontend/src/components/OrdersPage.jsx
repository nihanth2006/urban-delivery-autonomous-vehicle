import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { orderAPI } from '../utils/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const OrdersContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const OrdersCard = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 800px;
  margin-top: 40px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const OrdersHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const OrdersTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderItem = styled.div`
  background: rgba(245, 245, 245, 0.02);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(245, 245, 245, 0.2);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
`;

const OrderId = styled.div`
  font-size: 0.9rem;
  color: #B0BEC5;
`;

const OrderDate = styled.div`
  font-size: 0.9rem;
  color: #B0BEC5;
`;

const OrderStatus = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.status) {
      case 'pending':
        return 'rgba(255, 193, 7, 0.1)';
      case 'processing':
        return 'rgba(33, 150, 243, 0.1)';
      case 'shipped':
        return 'rgba(76, 175, 80, 0.1)';
      case 'delivered':
        return 'rgba(76, 175, 80, 0.2)';
      case 'cancelled':
        return 'rgba(244, 67, 54, 0.1)';
      default:
        return 'rgba(245, 245, 245, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending':
        return '#ffc107';
      case 'processing':
        return '#2196f3';
      case 'shipped':
        return '#4caf50';
      case 'delivered':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#F5F5F5';
    }
  }};
`;

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: rgba(245, 245, 245, 0.02);
  border-radius: 6px;
`;

const OrderItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-size: 0.9rem;
  color: #F5F5F5;
`;

const ItemQuantity = styled.div`
  font-size: 0.8rem;
  color: #B0BEC5;
`;

const ItemPrice = styled.div`
  font-size: 0.9rem;
  color: #F5F5F5;
  font-weight: 600;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid rgba(245, 245, 245, 0.1);
  font-weight: 600;
`;

const ShippingAddress = styled.div`
  font-size: 0.9rem;
  color: #B0BEC5;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(245, 245, 245, 0.1);
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #B0BEC5;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #B0BEC5;
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
  background: ${props => props.type === 'error' ? 'rgba(255, 82, 82, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  color: ${props => props.type === 'error' ? '#ff5252' : '#4caf50'};
  border: 1px solid ${props => props.type === 'error' ? 'rgba(255, 82, 82, 0.2)' : 'rgba(76, 175, 80, 0.2)'};
`;

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await orderAPI.getUserOrders();
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <OrdersContainer>
        <OrdersCard>
          <LoadingSpinner>Loading orders...</LoadingSpinner>
        </OrdersCard>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <OrdersCard>
        <OrdersHeader>
          <OrdersTitle>My Orders</OrdersTitle>
        </OrdersHeader>

        {error && (
          <Message type="error">{error}</Message>
        )}

        {orders.length === 0 ? (
          <NoOrders>No orders found</NoOrders>
        ) : (
          <OrdersList>
            {orders.map(order => (
              <OrderItem key={order.id}>
                <OrderHeader>
                  <OrderId>Order #{order.id}</OrderId>
                  <OrderDate>{formatDate(order.created_at)}</OrderDate>
                  <OrderStatus status={order.status}>{order.status}</OrderStatus>
                </OrderHeader>

                <OrderItems>
                  {order.items.map(item => (
                    <OrderItemRow key={item.id}>
                      <ItemDetails>
                        <ItemName>{item.product.title}</ItemName>
                        <ItemQuantity>Quantity: {item.quantity}</ItemQuantity>
                      </ItemDetails>
                      <ItemPrice>₹{(item.price * item.quantity).toFixed(2)}</ItemPrice>
                    </OrderItemRow>
                  ))}
                </OrderItems>

                <OrderTotal>
                  <span>Total Amount</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </OrderTotal>

                <ShippingAddress>
                  Shipping to: {order.shipping_address}
                </ShippingAddress>
              </OrderItem>
            ))}
          </OrdersList>
        )}
      </OrdersCard>
    </OrdersContainer>
  );
};

export default OrdersPage;