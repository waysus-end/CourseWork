import React, { useState } from 'react';
import SignCard from './SignCard';
import zodiacData from '../data/zodiacSigns.json';
import { saveUserSign } from '../utils/storage';
import styles from '../styles/SignSelector.module.css';

const SignSelector = ({ onSignSelected }) => {
  const [selectedSign, setSelectedSign] = useState(null);
  const [error, setError] = useState('');

  const handleSelect = (signId) => {
    setSelectedSign(signId);
    setError('');
  };

  const handleConfirm = () => {
    if (!selectedSign) {
      setError('Пожалуйста, выберите ваш знак зодиака');
      return;
    }

    const success = saveUserSign(selectedSign);
    if (success) {
      onSignSelected(selectedSign);
    } else {
      setError('Ошибка сохранения. Попробуйте еще раз');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Выберите ваш знак зодиака</h1>
        <p className={styles.subtitle}>
          Это поможет нам давать более персонализированные ответы
        </p>
      </div>

      <div className={styles.grid}>
        {zodiacData.signs.map((sign) => (
          <SignCard
            key={sign.id}
            sign={sign}
            isSelected={selectedSign === sign.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.footer}>
        <button 
          className={styles.confirmButton}
          onClick={handleConfirm}
          disabled={!selectedSign}
        >
          Подтвердить выбор
        </button>
      </div>
    </div>
  );
};

export default SignSelector;