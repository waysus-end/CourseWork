import React from 'react';
import styles from '../styles/MainMenu.module.css';

const MainMenu = ({ userSign, onSelectCategory, onResetAccount, onOpenHistory, onOpenSettings }) => {
  const categories = [
    {
      id: 'daily',
      name: 'РАДОСТИ ДНЯ',
      difficulty: 'easy',
      icon: '✦',
      description: 'еда, покупки, развлечения, мелкие планы',
      color: '#4CAF50'
    },
    {
      id: 'horizons',
      name: 'ГОРИЗОНТЫ',
      difficulty: 'medium',
      icon: '✈️',
      description: 'путешествия, друзья, перемены, саморазвитие',
      color: '#FF9800'
    },
    {
      id: 'heart',
      name: 'СЕРДЦЕ И СУДЬБА',
      difficulty: 'hard',
      icon: '💫',
      description: 'любовь, большие решения, мечты, судьба',
      color: '#E91E63'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Цифры судьбы</h1>
        <p className={styles.signInfo}>Ваш знак: {userSign}</p>
      </div>

      <div className={styles.menu}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={styles.menuButton}
            onClick={() => onSelectCategory(cat)}
            style={{ '--button-color': cat.color }}
          >
            <div className={styles.buttonIcon}>{cat.icon}</div>
            <div className={styles.buttonContent}>
              <div className={styles.buttonTitle}>{cat.name}</div>
              <div className={styles.buttonDifficulty}>
                {cat.difficulty === 'easy' && 'легкое'}
                {cat.difficulty === 'medium' && 'среднее'}
                {cat.difficulty === 'hard' && 'сложное'}
              </div>
              <div className={styles.buttonDescription}>{cat.description}</div>
            </div>
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.historyButton} onClick={onOpenHistory}>
          📜 История вопросов
        </button>
        <button className={styles.settingsButton} onClick={onOpenSettings}>
          ⚙️ Настройки
        </button>
        <button className={styles.resetButton} onClick={onResetAccount}>
          Сбросить аккаунт
        </button>
      </div>
    </div>
  );
};

export default MainMenu;