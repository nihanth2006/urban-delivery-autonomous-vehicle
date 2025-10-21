import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { productAPI, cartAPI } from '../utils/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const ProductContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductCard = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 1200px;
  margin-top: 40px;
  animation: ${fadeIn} 0.6s ease-out;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
`;

const ImageSection = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  background: rgba(245, 245, 245, 0.02);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const ImageFallback = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  color: #B0BEC5;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${slideIn} 0.6s ease-out;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
`;

const ProductPrice = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #F5F5F5;
`;

const ProductCategory = styled.div`
  display: inline-block;
  padding: 6px 12px;
  background: rgba(245, 245, 245, 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  color: #B0BEC5;
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #B0BEC5;
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: ${props => props.inStock ? '#4caf50' : '#ff5252'};

  &::before {
    content: "";
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.inStock ? '#4caf50' : '#ff5252'};
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 20px 0;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid rgba(245, 245, 245, 0.2);
  border-radius: 8px;
  background: transparent;
  color: #F5F5F5;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(245, 245, 245, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 16px;
  background: transparent;
  border: 2px solid #F5F5F5;
  border-radius: 8px;
  color: #F5F5F5;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;

  &:hover {
    background: #F5F5F5;
    color: #000000;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const BackButton = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  background: transparent;
  border: 1px solid rgba(245, 245, 245, 0.2);
  color: #F5F5F5;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(245, 245, 245, 0.1);
  }
`;

const Message = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
  background: ${props => props.type === 'error' ? 'rgba(255, 82, 82, 0.1)' : 'rgba(76, 175, 80, 0.1)'};
  color: ${props => props.type === 'error' ? '#ff5252' : '#4caf50'};
  border: 1px solid ${props => props.type === 'error' ? 'rgba(255, 82, 82, 0.2)' : 'rgba(76, 175, 80, 0.2)'};
`;

const ProductPage = ({ productId, onNavigateBack }) => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const productData = await productAPI.getById(productId);
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage({ type: 'error', text: 'Error loading product details' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await cartAPI.addToCart(productId, quantity);
      setMessage({ type: 'success', text: 'Added to cart successfully' });
      
      // Reset quantity after successful addition
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({ type: 'error', text: 'Error adding to cart' });
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <ProductContainer>
        <ProductCard>Loading...</ProductCard>
      </ProductContainer>
    );
  }

  if (!product) {
    return (
      <ProductContainer>
        <ProductCard>Product not found</ProductCard>
      </ProductContainer>
    );
  }

  return (
    <ProductContainer>
      <BackButton onClick={onNavigateBack}>
        ← Back
      </BackButton>

      <ProductCard>
        <ImageSection>
          {product.image_url ? (
            <ProductImage 
              src={product.image_url} 
              alt={product.title}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <ImageFallback>📦</ImageFallback>
          )}
        </ImageSection>

        <InfoSection>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductTitle>{product.title}</ProductTitle>
          <ProductPrice>₹{product.price.toFixed(2)}</ProductPrice>
          
          <StockInfo inStock={product.stock > 0}>
            {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </StockInfo>

          <ProductDescription>{product.description}</ProductDescription>

          <QuantitySelector>
            <QuantityButton 
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1 || product.stock === 0}
            >
              -
            </QuantityButton>
            <QuantityDisplay>{quantity}</QuantityDisplay>
            <QuantityButton 
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product.stock}
            >
              +
            </QuantityButton>
          </QuantitySelector>

          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock === 0}
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </AddToCartButton>

          {message && (
            <Message type={message.type}>
              {message.text}
            </Message>
          )}
        </InfoSection>
      </ProductCard>
    </ProductContainer>
  );
};

export default ProductPage;