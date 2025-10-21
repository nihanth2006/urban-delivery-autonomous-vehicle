import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { userAPI } from '../utils/api';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SettingsContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #000000;
  color: #F5F5F5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SettingsCard = styled.div`
  background: rgba(245, 245, 245, 0.05);
  border: 1px solid rgba(245, 245, 245, 0.1);
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 600px;
  margin-top: 40px;
  animation: ${fadeIn} 0.6s ease-out;
`;

const SettingsHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const SettingsTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 10px;
`;

const SettingsSubtitle = styled.p`
  color: #B0BEC5;
  font-size: 0.9rem;
`;

const Section = styled.section`
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid rgba(245, 245, 245, 0.1);

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #F5F5F5;
`;

const ToggleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const ToggleLabel = styled.label`
  font-size: 1rem;
  color: #F5F5F5;
`;

const ToggleDescription = styled.p`
  font-size: 0.9rem;
  color: #B0BEC5;
  margin-top: 4px;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(245, 245, 245, 0.1);
  transition: 0.4s;
  border-radius: 34px;

  &:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: #F5F5F5;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + & {
    background-color: rgba(76, 175, 80, 0.5);
  }

  input:checked + &:before {
    transform: translateX(26px);
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
  width: 100%;
  margin-top: 20px;

  &:hover {
    background: #F5F5F5;
    color: #000000;
    transform: translateY(-2px);
  }

  &.danger {
    border-color: #ff5252;
    color: #ff5252;

    &:hover {
      background: #ff5252;
      color: #F5F5F5;
    }
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

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    darkMode: true,
  });
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage or API
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (setting) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        [setting]: !prev[setting]
      };
      localStorage.setItem('userSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Save settings to backend (if needed)
      const userData = JSON.parse(localStorage.getItem('userProfile'));
      await userAPI.updateSettings(userData.uid, settings);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Error saving settings' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion logic
      alert('Account deletion not implemented yet');
    }
  };

  return (
    <SettingsContainer>
      <SettingsCard>
        <SettingsHeader>
          <SettingsTitle>Settings</SettingsTitle>
          <SettingsSubtitle>Manage your account preferences</SettingsSubtitle>
        </SettingsHeader>

        <Section>
          <SectionTitle>Notifications</SectionTitle>
          
          <ToggleGroup>
            <div>
              <ToggleLabel>Email Notifications</ToggleLabel>
              <ToggleDescription>Receive order updates and delivery notifications via email</ToggleDescription>
            </div>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle('emailNotifications')}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleGroup>

          <ToggleGroup>
            <div>
              <ToggleLabel>SMS Notifications</ToggleLabel>
              <ToggleDescription>Receive text messages for important updates</ToggleDescription>
            </div>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={() => handleToggle('smsNotifications')}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleGroup>

          <ToggleGroup>
            <div>
              <ToggleLabel>Marketing Emails</ToggleLabel>
              <ToggleDescription>Receive promotional offers and newsletters</ToggleDescription>
            </div>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleGroup>
        </Section>

        <Section>
          <SectionTitle>Appearance</SectionTitle>
          
          <ToggleGroup>
            <div>
              <ToggleLabel>Dark Mode</ToggleLabel>
              <ToggleDescription>Toggle between dark and light theme</ToggleDescription>
            </div>
            <ToggleSwitch>
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={() => handleToggle('darkMode')}
              />
              <Slider />
            </ToggleSwitch>
          </ToggleGroup>
        </Section>

        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>

        <Section>
          <SectionTitle>Danger Zone</SectionTitle>
          <Button className="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Section>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}
      </SettingsCard>
    </SettingsContainer>
  );
};

export default SettingsPage;