import React, { useState } from 'react';
import { clearHistory, resetAccount } from '../utils/storage';
import styles from '../styles/SettingsPage.module.css';

const SettingsPage = ({ userSign, onBack, onResetAccount }) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
    alert('История очищена');
  };

  const handleResetAccount = () => {
    resetAccount();
    onResetAccount();
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button className={styles.backButton} onClick={onBack}>
          ← Назад
        </button>
        
        <h1 className={styles.title}>⚙️ Настройки</h1>
        
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📜 История</h2>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingIcon}>🗑</span>
              <span className={styles.settingLabel}>Очистить историю вопросов</span>
            </div>
            {!showClearConfirm ? (
              <button className={styles.dangerButton} onClick={() => setShowClearConfirm(true)}>
                Очистить
              </button>
            ) : (
              <div className={styles.confirmButtons}>
                <button className={styles.cancelButton} onClick={() => setShowClearConfirm(false)}>
                  Отмена
                </button>
                <button className={styles.confirmButton} onClick={handleClearHistory}>
                  Да, очистить
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>👤 Аккаунт</h2>
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingIcon}>⟳</span>
              <span className={styles.settingLabel}>Сменить знак зодиака</span>
            </div>
            {!showResetConfirm ? (
              <button className={styles.warningButton} onClick={() => setShowResetConfirm(true)}>
                Сменить
              </button>
            ) : (
              <div className={styles.confirmButtons}>
                <button className={styles.cancelButton} onClick={() => setShowResetConfirm(false)}>
                  Отмена
                </button>
                <button className={styles.confirmButton} onClick={handleResetAccount}>
                  Да, сменить
                </button>
              </div>
            )}
          </div>
          
          {/* Новая кнопка сброса аккаунта */}
          <div className={styles.settingItem}>
            <div className={styles.settingInfo}>
              <span className={styles.settingIcon}>🗑</span>
              <span className={styles.settingLabel}>Сбросить весь аккаунт</span>
            </div>
            <button className={styles.dangerButton} onClick={handleResetAccount}>
              Сбросить
            </button>
          </div>
        </div>

        <div className={styles.footer}>
          <p className={styles.version}>Цифры судьбы v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;