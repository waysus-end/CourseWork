import React from 'react';
import styles from '../styles/WelcomePage.module.css';

const WelcomePage = ({ onStart }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.symbol}>🔮</div>
        <h1 className={styles.title}>Цифры судьбы</h1>
        
        <div className={styles.description}>
          <p>Реши судоку — задай вопрос — получи ответ</p>
          <p>Три уровня сложности ждут тебя:</p>
          <ul className={styles.list}>
            <li>✦ Радости дня — лёгкие вопросы о мелочах</li>
            <li>✦ Горизонты — средние вопросы о жизни</li>
            <li>✦ Сердце и судьба — самые важные вопросы</li>
          </ul>
          <p>Ответ подберётся специально для твоего знака зодиака</p>
        </div>
        
        <button className={styles.button} onClick={onStart}>
          Начать путь →
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;