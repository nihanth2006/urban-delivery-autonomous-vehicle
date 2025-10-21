import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { userAPI } from '../utils/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const ProfileContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileCard = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  margin-top: 40px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const ProfileAvatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  background: rgba(245, 245, 245, 0.1);
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  color: #B0BEC5;
`;

const Input = styled.input`
  padding: 12px 16px;
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 8px;
  color: #F5F5F5;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #F5F5F5;
    background: rgba(245, 245, 245, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 14px;
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

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userProfile'));
      if (userData) {
        setProfile(userData);
        setFormData({
          fullName: userData.fullName || '',
          phoneNumber: userData.phoneNumber || '',
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Error loading profile' });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('userProfile'));
      const updatedProfile = await userAPI.updateProfile(userData.uid, {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
      });

      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify({
        ...userData,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
      }));

      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Error updating profile' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <ProfileContainer>
        <ProfileCard>
          <ProfileHeader>
            <ProfileTitle>Loading...</ProfileTitle>
          </ProfileHeader>
        </ProfileCard>
      </ProfileContainer>
    );
  }

  return (
    <ProfileContainer>
      <ProfileCard>
        <ProfileHeader>
          <ProfileAvatar>
            👤
          </ProfileAvatar>
          <ProfileTitle>
            {isEditing ? 'Edit Profile' : 'My Profile'}
          </ProfileTitle>
        </ProfileHeader>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Email</Label>
            <Input
              type="email"
              value={profile?.email || ''}
              disabled
            />
          </FormGroup>

          <FormGroup>
            <Label>Full Name</Label>
            <Input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your full name"
            />
          </FormGroup>

          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </FormGroup>

          {isEditing ? (
            <>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Form>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
};

export default ProfilePage;