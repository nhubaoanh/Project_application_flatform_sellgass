import React from 'react';
import { ProfileScreen } from '../../src/screens/profile/ProfileScreen';
import { useRouter } from 'expo-router';

const ProfilePage = () => {
  const router = useRouter();
  
  const handleBack = () => {
    // Handle back navigation
    router.back();
  };

  const handleEditProfile = () => {
    // Handle edit profile
    console.log('Edit profile pressed');
  };

  const handleSettings = () => {
    // Handle settings
    console.log('Settings pressed');
  };

  const handleHelp = () => {
    // Handle help
    console.log('Help pressed');
  };

  const handleLogout = () => {
    // Handle logout
    console.log('Logout pressed');
  };

  return (
    <ProfileScreen
      onBack={handleBack}
      onEditProfile={handleEditProfile}
      onSettings={handleSettings}
      onHelp={handleHelp}
      onLogout={handleLogout}
    />
  );
};

export default ProfilePage;
