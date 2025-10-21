import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../utils/AuthContext';
import { signIn, signUp } from '../utils/firebase';

// --- Keyframes for Animation ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

// --- Styled Components ---

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  padding: 20px;
  position: relative;
  z-index: 10;
  overflow-y: auto;
`;

const AuthCard = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  animation: ${fadeIn} 0.6s ease-out;
  margin: 40px 0;
  flex-shrink: 0;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
`;

const AuthTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: #F5F5F5;
`;

const LoginLink = styled.button`
  background: none;
  border: none;
  color: #4299e1;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
  margin-top: 10px;

  &:hover {
    color: #63b3ed;
  }
`;

const AuthSubtitle = styled.p`
  font-size: 0.9rem;
  color: #B0BEC5;
  margin: 0;
`;

const ToggleContainer = styled.div`
  display: flex;
  background: rgba(245, 245, 245, 0.1);
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 30px;
`;

const ToggleButton = styled.button`
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? '#F5F5F5' : 'transparent'};
  color: ${props => props.active ? '#000000' : '#F5F5F5'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.active ? '#F5F5F5' : 'rgba(245, 245, 245, 0.1)'};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: ${slideIn} 0.4s ease-out;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #F5F5F5;
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid rgba(245, 245, 245, 0.2);
  border-radius: 8px;
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

const SubmitButton = styled.button`
  padding: 14px;
  border: 2px solid #F5F5F5;
  border-radius: 8px;
  background: transparent;
  color: #F5F5F5;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;

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

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: transparent;
  border: 1px solid rgba(245, 245, 245, 0.3);
  color: #F5F5F5;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    background: rgba(245, 245, 245, 0.1);
    border-color: #F5F5F5;
  }
`;

// --- React Component ---

const AuthenticationPage = ({ onNavigateToLanding, onNavigateToECommerce }) => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      if (isLogin) {
        const { user, token } = await signIn(formData.email, formData.password);
        console.log('Login successful:', user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', user.email);
        
        // Fetch user profile data from backend
        try {
          const response = await fetch(`http://localhost:8000/api/users/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const profileData = await response.json();
            localStorage.setItem('userProfile', JSON.stringify(profileData));
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
        
        onNavigateToECommerce();
      } else {
        const { user, token } = await signUp(formData.email, formData.password);
        console.log('Registration successful:', user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userEmail', user.email);
        
        try {
          // Call backend API to store additional user data
          const response = await fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email: formData.email,
              firebase_uid: user.uid,
              full_name: formData.fullName,
              phone_number: formData.phoneNumber
            })
          });

          if (!response.ok) {
            throw new Error('Failed to store user data');
          }
          
          // Store user profile in localStorage
          const profileData = {
            email: formData.email,
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            uid: user.uid
          };
          localStorage.setItem('userProfile', JSON.stringify(profileData));
        } catch (backendError) {
          console.error('Backend error:', backendError);
          setErrors(prev => ({
            ...prev,
            backend: 'Error connecting to server. Please try again.'
          }));
          return;
        }

        onNavigateToECommerce();
      }
      
      // Reset form after successful submission
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
      });
      
    } catch (error) {
      console.error('Authentication error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.message.includes('Invalid email or password')) {
        errorMessage = error.message;
      } else if (error.message.includes('Too many failed login attempts')) {
        errorMessage = error.message;
      } else if (error.message.includes('auth/email-already-in-use')) {
        errorMessage = 'An account with this email already exists.';
      } else if (error.message.includes('auth/invalid-email')) {
        errorMessage = 'Invalid email address.';
      } else if (error.message.includes('auth/weak-password')) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }

      setErrors(prev => ({
        ...prev,
        auth: errorMessage
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: ''
    });
  };

  return (
    <AuthContainer>
      <BackButton onClick={onNavigateToLanding}>
        ← Back to Home
      </BackButton>
      
      <AuthCard>
        <AuthHeader>
          <AuthTitle>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </AuthTitle>
          <AuthSubtitle>
            {isLogin ? 'Sign in to your account' : 'Sign up to get started'}
          </AuthSubtitle>
        </AuthHeader>

        <ToggleContainer>
          <ToggleButton
            type="button"
            active={isLogin}
            onClick={() => !isLogin && switchMode()}
          >
            Login
          </ToggleButton>
          <ToggleButton
            type="button"
            active={!isLogin}
            onClick={() => isLogin && switchMode()}
          >
            Register
          </ToggleButton>
        </ToggleContainer>

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <FormGroup>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
              {errors.fullName && <ErrorMessage>{errors.fullName}</ErrorMessage>}
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          </FormGroup>

          {!isLogin && (
            <FormGroup>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
              {errors.phoneNumber && <ErrorMessage>{errors.phoneNumber}</ErrorMessage>}
            </FormGroup>
          )}

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          </FormGroup>

          {!isLogin && (
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
            </FormGroup>
          )}

          {(errors.auth || errors.backend) && (
            <ErrorMessage>
              {errors.auth || errors.backend}
              {errors.auth?.includes('already registered') && (
                <LoginLink onClick={() => setIsLogin(true)}>
                  Click here to login instead
                </LoginLink>
              )}
            </ErrorMessage>
          )}
          
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </SubmitButton>
        </Form>
      </AuthCard>
    </AuthContainer>
  );
};

export default AuthenticationPage;
