import React, { useState } from 'react';
import './App.css';
import WelcomePage from './components/WelcomePage';
import SignSelector from './components/SignSelector';
import MainMenu from './components/MainMenu';
import SudokuGame from './components/SudokuGame';
import AnswerPage from './components/AnswerPage';
import HistoryPage from './components/HistoryPage';
import SettingsPage from './components/SettingsPage';
import { hasVisitedWelcome, markWelcomeVisited, loadUserSign, resetAccount } from './utils/storage';
import zodiacData from './data/zodiacSigns.json';

function App() {
  const [step, setStep] = useState('welcome');
  const [userSign, setUserSign] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [gameResult, setGameResult] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const getSignName = (signId) => {
    const sign = zodiacData.signs.find(s => s.id === signId);
    return sign ? sign.name : signId;
  };

  React.useEffect(() => {
  const init = async () => {
    const visited = hasVisitedWelcome();
    const savedSign = await loadUserSign();
    
    if (savedSign) {
      setUserSign(savedSign);
      setStep('mainMenu');
    } else if (visited) {
      setStep('signSelector');
    } else {
      setStep('welcome');
    }
  };
  
  init();
}, []);

  const handleWelcomeComplete = () => {
    markWelcomeVisited();
    setStep('signSelector');
  };

  const handleSignSelected = (sign) => {
    setUserSign(sign);
    setStep('mainMenu');
  };

  const handleReset = () => {
    resetAccount();
    setUserSign(null);
    setSelectedCategory(null);
    setGameResult(null);
    setShowHistory(false);
    setShowSettings(false);
    setStep('welcome');
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setStep('game');
  };

  const handleGameComplete = (gameData) => {
    setGameResult(gameData);
    setStep('answer');
  };

  const handleBackToMainMenu = () => {
    setSelectedCategory(null);
    setGameResult(null);
    setStep('mainMenu');
  };

  const handleOpenHistory = () => {
    setShowHistory(true);
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
  };

  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  if (showHistory) {
    return (
      <HistoryPage
        userSignId={getSignName(userSign)}
        onBack={handleCloseHistory}
      />
    );
  }

  if (showSettings) {
    return (
      <SettingsPage
        userSign={getSignName(userSign)}
        onBack={handleCloseSettings}
        onResetAccount={handleReset}
      />
    );
  }

  if (step === 'welcome') {
    return <WelcomePage onStart={handleWelcomeComplete} />;
  }

  if (step === 'signSelector') {
    return <SignSelector onSignSelected={handleSignSelected} />;
  }

  if (step === 'mainMenu') {
    return (
      <MainMenu 
        userSign={getSignName(userSign)}
        onSelectCategory={handleSelectCategory}
        onOpenHistory={handleOpenHistory}
        onOpenSettings={handleOpenSettings}
      />
    );
  }

  if (step === 'game') {
    return (
      <SudokuGame
        difficulty={selectedCategory.difficulty}
        category={selectedCategory}
        onComplete={handleGameComplete}
        onBack={handleBackToMainMenu}
      />
    );
  }

  if (step === 'answer') {
    return (
      <AnswerPage
        userSignId={userSign}
        category={selectedCategory}
        gameData={gameResult}
        onBackToMenu={handleBackToMainMenu}
      />
    );
  }

  return null;
}

export default App;