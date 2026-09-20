import React from 'react';
import LandingApp from '../landing/App.jsx';

interface LandingPageProps {
  onNavigateLogin: () => void;
  onExplorePlatform: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateLogin,
  onExplorePlatform,
}) => {
  return (
    <LandingApp 
      onNavigateLogin={onNavigateLogin} 
      onExplorePlatform={onExplorePlatform} 
    />
  );
};
