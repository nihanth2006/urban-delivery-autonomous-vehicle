import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MenuContainer = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
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

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 8px;
  padding: 8px 0;
  min-width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 0.2s ease-out;
  z-index: 1000;
`;

const ProfileInfo = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(245, 245, 245, 0.1);
`;

const FullName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #F5F5F5;
  margin-bottom: 4px;
`;

const Email = styled.div`
  font-size: 0.8rem;
  color: #B0BEC5;
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  color: #F5F5F5;
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: rgba(245, 245, 245, 0.1);
  }
`;

const ProfileMenu = ({ onLogout, onProfileClick, onSettingsClick, onOrdersClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(JSON.parse(localStorage.getItem('userProfile') || '{}'));
  const menuRef = useRef();

  const fetchProfileData = async () => {
    const token = localStorage.getItem('authToken');
    const storedProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    try {
      const response = await fetch(`http://localhost:8000/api/users/${storedProfile.uid}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const profileData = await response.json();
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        setUserProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProfileData();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userProfile');
    onLogout();
  };

  return (
    <MenuContainer ref={menuRef}>
      <ProfileButton onClick={() => setIsOpen(!isOpen)}>
        👤 {userProfile.fullName?.split(' ')[0] || 'Profile'}
      </ProfileButton>

      {isOpen && (
        <DropdownMenu>
          <ProfileInfo>
            <FullName>{userProfile.fullName || 'User'}</FullName>
            <Email>{userProfile.email}</Email>
          </ProfileInfo>

          <MenuItem onClick={() => {
            setIsOpen(false);
            onProfileClick();
          }}>
            👤 View Profile
          </MenuItem>
          <MenuItem onClick={() => {
            setIsOpen(false);
            onSettingsClick();
          }}>
            ⚙️ Settings
          </MenuItem>
          <MenuItem onClick={() => {
            setIsOpen(false);
            onOrdersClick();
          }}>
            📦 My Orders
          </MenuItem>
          <MenuItem onClick={handleLogout} style={{ color: '#ff6b6b' }}>
            🚪 Logout
          </MenuItem>
        </DropdownMenu>
      )}
    </MenuContainer>
  );
};

export default ProfileMenu;