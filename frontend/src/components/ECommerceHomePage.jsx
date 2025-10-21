import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ProfileMenu from './ProfileMenu';

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

const HomeContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  overflow-x: hidden;
`;

// --- Header Section ---
const Header = styled.header`
  position: sticky;
  top: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(245, 245, 245, 0.1);
  padding: 15px 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 15px;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #F5F5F5;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    color: #B0BEC5;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 1px solid rgba(245, 245, 245, 0.2);
  border-radius: 25px;
  background: rgba(245, 245, 245, 0.05);
  color: #F5F5F5;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #F5F5F5;
    background: rgba(245, 245, 245, 0.1);
  }

  &::placeholder {
    color: #B0BEC5;
  }
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  color: #B0BEC5;
  font-size: 1.2rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ActionButton = styled.button`
  background: transparent;
  border: 1px solid rgba(245, 245, 245, 0.2);
  color: #F5F5F5;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(245, 245, 245, 0.1);
    border-color: #F5F5F5;
  }
`;

const CartButton = styled(ActionButton)`
  position: relative;
  
  &::after {
    content: '${props => props.count || ''}';
    position: absolute;
    top: -8px;
    right: -8px;
    background: #F5F5F5;
    color: #000000;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    opacity: ${props => props.count > 0 ? 1 : 0};
  }
`;

// --- Category Bar Section ---
const CategorySection = styled.section`
  padding: 20px;
  background: rgba(245, 245, 245, 0.02);
  border-bottom: 1px solid rgba(245, 245, 245, 0.1);
`;

const CategoryTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 15px 0;
  color: #F5F5F5;
`;

const CategoryList = styled.div`
  display: flex;
  gap: 15px;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(245, 245, 245, 0.3) transparent;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(245, 245, 245, 0.3);
    border-radius: 3px;
  }
`;

const CategoryItem = styled.button`
  background: ${props => props.active ? '#F5F5F5' : 'rgba(245, 245, 245, 0.1)'};
  color: ${props => props.active ? '#000000' : '#F5F5F5'};
  border: 1px solid rgba(245, 245, 245, 0.2);
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    background: ${props => props.active ? '#F5F5F5' : 'rgba(245, 245, 245, 0.2)'};
    transform: translateY(-2px);
  }
`;

// --- Product Grid Section ---
const ProductSection = styled.section`
  padding: 30px 20px;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ProductCard = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: rgba(245, 245, 245, 0.3);
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: rgba(245, 245, 245, 0.1);
  border-radius: 8px;
  margin-bottom: 15px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
  
  .fallback-icon {
    font-size: 3rem;
    color: #B0BEC5;
  }
`;

const ProductTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #F5F5F5;
  line-height: 1.3;
`;

const ProductPrice = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #F5F5F5;
  margin-bottom: 15px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: 2px solid #F5F5F5;
  color: #F5F5F5;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: #F5F5F5;
    color: #000000;
    transform: translateY(-2px);
  }

  &:active {
    animation: ${pulse} 0.3s ease;
  }
`;

// --- React Component ---

const ECommerceHomePage = ({ 
  onNavigateToAuth, 
  onNavigateToLanding, 
  onNavigateToDelivery,
  onNavigateToProfile,
  onNavigateToSettings,
  onNavigateToOrders,
  onNavigateToProduct
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const categories = [
    'All', 'Mobiles', 'TVs', 'Fashion', 'Electronics', 'Home & Garden',
    'Sports', 'Books', 'Beauty', 'Toys', 'Automotive', 'Health'
  ];

  const products = [
    { 
      id: 1, 
      title: 'iPhone 15 Pro Max', 
      price: '₹1,29,900', 
      category: 'Mobiles', 
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop&crop=center',
      fallback: '📱'
    },
    { 
      id: 2, 
      title: 'Samsung 55" 4K Smart TV', 
      price: '₹89,999', 
      category: 'TVs', 
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop&crop=center',
      fallback: '📺'
    },
    { 
      id: 3, 
      title: 'Premium Leather Jacket', 
      price: '₹12,999', 
      category: 'Fashion', 
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=300&fit=crop&crop=center',
      fallback: '🧥'
    },
    { 
      id: 4, 
      title: 'Sony WH-1000XM5 Headphones', 
      price: '₹24,990', 
      category: 'Electronics', 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&crop=center',
      fallback: '🎧'
    },
    { 
      id: 5, 
      title: 'Professional Garden Tools Set', 
      price: '₹5,999', 
      category: 'Home & Garden', 
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center',
      fallback: '🌱'
    },
    { 
      id: 6, 
      title: 'Nike Air Max Running Shoes', 
      price: '₹9,999', 
      category: 'Sports', 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop&crop=center',
      fallback: '👟'
    },
    { 
      id: 7, 
      title: 'JavaScript Complete Guide', 
      price: '₹2,999', 
      category: 'Books', 
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop&crop=center',
      fallback: '📚'
    },
    { 
      id: 8, 
      title: 'Premium Skincare Kit', 
      price: '₹4,999', 
      category: 'Beauty', 
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&crop=center',
      fallback: '💄'
    },
    { 
      id: 9, 
      title: 'Transformers Action Figure', 
      price: '₹1,999', 
      category: 'Toys', 
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
      fallback: '🤖'
    },
    { 
      id: 10, 
      title: 'Car Dashboard Camera', 
      price: '₹8,999', 
      category: 'Automotive', 
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center',
      fallback: '🚗'
    },
    { 
      id: 11, 
      title: 'Apple Watch Series 9', 
      price: '₹45,900', 
      category: 'Health', 
      image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=300&fit=crop&crop=center',
      fallback: '⌚'
    },
    { 
      id: 12, 
      title: 'PlayStation 5 Console', 
      price: '₹49,990', 
      category: 'Electronics', 
      image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop&crop=center',
      fallback: '🎮'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (productId) => {
    setCartCount(prev => prev + 1);
    // Here you would typically add the product to a cart state
    console.log(`Added product ${productId} to cart`);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <HomeContainer>
      {/* Header */}
      <Header>
        <Logo onClick={onNavigateToLanding}>
          🚀 Parcel Delivery
        </Logo>
        
        <SearchContainer>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </SearchContainer>
        
        <HeaderActions>
          <CartButton count={cartCount} onClick={onNavigateToDelivery}>
            🛒 Cart
          </CartButton>
          {isLoggedIn ? (
            <ProfileMenu 
              onLogout={() => {
                setIsLoggedIn(false);
                onNavigateToLanding();
              }}
              onProfileClick={onNavigateToProfile}
              onSettingsClick={onNavigateToSettings}
              onOrdersClick={onNavigateToOrders}
            />
          ) : (
            <ActionButton onClick={onNavigateToAuth}>
              👤 Login
            </ActionButton>
          )}
        </HeaderActions>
      </Header>

      {/* Category Bar */}
      <CategorySection>
        <CategoryTitle>Shop by Category</CategoryTitle>
        <CategoryList>
          {categories.map(category => (
            <CategoryItem
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryItem>
          ))}
        </CategoryList>
      </CategorySection>

      {/* Product Grid */}
      <ProductSection>
        <ProductGrid>
          {filteredProducts.map(product => (
            <ProductCard key={product.id}>
              <ProductImage>
                <img 
                  src={product.image} 
                  alt={product.title}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="fallback-icon" style={{ display: 'none' }}>
                  {product.fallback}
                </div>
              </ProductImage>
              <ProductTitle>{product.title}</ProductTitle>
              <ProductPrice>{product.price}</ProductPrice>
              <div style={{ display: 'flex', gap: '10px' }}>
                <AddToCartButton onClick={() => handleAddToCart(product.id)}>
                  Add to Cart
                </AddToCartButton>
                <AddToCartButton onClick={() => onNavigateToProduct(product.id)}>
                  View Details
                </AddToCartButton>
              </div>
            </ProductCard>
          ))}
        </ProductGrid>
      </ProductSection>
    </HomeContainer>
  );
};

export default ECommerceHomePage;
