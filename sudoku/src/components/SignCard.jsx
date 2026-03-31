import React from 'react';
import styles from '../styles/SignCard.module.css';

const SignCard = ({ sign, isSelected, onSelect }) => {
  const handleClick = () => {
    onSelect(sign.id);
  };

  return (
    <div 
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
      style={{ '--card-color': sign.color }}
    >
      <div className={styles.symbol}>{sign.symbol}</div>
      <div className={styles.content}>
        <h3 className={styles.name}>{sign.name}</h3>
        <p className={styles.dates}>{sign.dates}</p>
        <p className={styles.description}>{sign.description}</p>
      </div>
      {isSelected && (
        <div className={styles.checkmark}>✓</div>
      )}
    </div>
  );
};

export default SignCard;