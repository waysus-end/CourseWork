import React, { useState, useEffect } from 'react';
import { loadHistory, clearHistory } from '../utils/storage';
import zodiacData from '../data/zodiacSigns.json';
import styles from '../styles/HistoryPage.module.css';

const HistoryPage = ({ userSignId, onBack }) => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем историю при монтировании
  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = async () => {
    setIsLoading(true);
    try {
      const data = await loadHistory();
      // Проверяем, что data - это массив
      if (Array.isArray(data)) {
        // Сортируем по дате (новые сверху)
        const sortedData = [...data].sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(sortedData);
      } else {
        console.error('loadHistory вернул не массив:', data);
        setHistory([]);
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Получаем информацию о знаке
  const signInfo = zodiacData.signs.find(s => s.id === userSignId);
  const signSymbol = signInfo?.symbol || '⭐';

  // Фильтрация по категориям
  const getFilteredHistory = () => {
    if (!Array.isArray(history)) return [];
    if (filter === 'all') return history;
    return history.filter(item => {
      if (filter === 'daily') return item.category === 'РАДОСТИ ДНЯ';
      if (filter === 'horizons') return item.category === 'ГОРИЗОНТЫ';
      if (filter === 'heart') return item.category === 'СЕРДЦЕ И СУДЬБА';
      return true;
    });
  };

  // Очистка всей истории
  const handleClearHistory = async () => {
    try {
      await clearHistory();
      await loadHistoryData();
      setShowConfirm(false);
    } catch (error) {
      console.error('Ошибка очистки:', error);
    }
  };

  // Экспорт истории в TXT
  const exportHistoryToText = () => {
    if (!Array.isArray(history) || history.length === 0) {
      alert('Нет истории для экспорта');
      return;
    }

    let text = '═══════════════════════════════════════\n';
    text += '         ЦИФРЫ СУДЬБЫ - ИСТОРИЯ\n';
    text += '═══════════════════════════════════════\n\n';
    
    history.forEach((item, index) => {
      text += `📌 ВОПРОС #${index + 1}\n`;
      text += `📅 Дата: ${formatDate(item.date)}\n`;
      text += `📂 Категория: ${item.category}\n`;
      text += `⏱️ Время: ${formatTime(item.time)}\n`;
      text += `❌ Ошибок: ${item.errors || 0}\n`;
      text += `💡 Подсказок: ${item.hintsUsed || 0}\n`;
      text += `❓ Вопрос: "${item.question}"\n`;
      text += `✨ Ответ: ${item.answer}\n`;
      text += '───────────────────────────────────\n\n';
    });
    
    text += `\n📊 ВСЕГО ВОПРОСОВ: ${history.length}\n`;
    text += `📅 Дата экспорта: ${new Date().toLocaleString('ru-RU')}\n`;
    text += '═══════════════════════════════════════';
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cifry-sudby-history-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Форматирование даты
  const formatDate = (dateString) => {
    if (!dateString) return 'дата неизвестна';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) {
        return `сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (days === 1) {
        return `вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
      }
    } catch {
      return 'дата неизвестна';
    }
  };

  // Получение иконки для категории
  const getCategoryIcon = (category) => {
    if (category === 'РАДОСТИ ДНЯ') return '✦';
    if (category === 'ГОРИЗОНТЫ') return '✈️';
    if (category === 'СЕРДЦЕ И СУДЬБА') return '💫';
    return '📋';
  };

  // Получение цвета для категории
  const getCategoryColor = (category) => {
    if (category === 'РАДОСТИ ДНЯ') return '#4CAF50';
    if (category === 'ГОРИЗОНТЫ') return '#FF9800';
    if (category === 'СЕРДЦЕ И СУДЬБА') return '#E91E63';
    return '#666';
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredHistory = getFilteredHistory();

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Загрузка истории...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBack}>
            ← Назад
          </button>
          <h1 className={styles.title}>📜 История вопросов</h1>
          <div className={styles.signBadge}>
            {signSymbol} {userSignId}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{history.length}</span>
            <span className={styles.statLabel}>всего вопросов</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {history.filter(h => h.category === 'РАДОСТИ ДНЯ').length}
            </span>
            <span className={styles.statLabel}>радости дня</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {history.filter(h => h.category === 'ГОРИЗОНТЫ').length}
            </span>
            <span className={styles.statLabel}>горизонты</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>
              {history.filter(h => h.category === 'СЕРДЦЕ И СУДЬБА').length}
            </span>
            <span className={styles.statLabel}>сердце и судьба</span>
          </div>
        </div>

        <div className={styles.filterBar}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Все
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'daily' ? styles.active : ''}`}
            onClick={() => setFilter('daily')}
            style={{ '--filter-color': '#4CAF50' }}
          >
            ✦ Радости
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'horizons' ? styles.active : ''}`}
            onClick={() => setFilter('horizons')}
            style={{ '--filter-color': '#FF9800' }}
          >
            ✈️ Горизонты
          </button>
          <button
            className={`${styles.filterButton} ${filter === 'heart' ? styles.active : ''}`}
            onClick={() => setFilter('heart')}
            style={{ '--filter-color': '#E91E63' }}
          >
            💫 Судьба
          </button>
        </div>

        {/* Кнопка экспорта в TXT */}
        {history.length > 0 && (
          <div className={styles.exportButtons}>
            <button className={styles.exportButton} onClick={exportHistoryToText}>
              📝 Экспорт истории (TXT)
            </button>
          </div>
        )}

        {filteredHistory.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyEmoji}>🔮</div>
            <p className={styles.emptyText}>
              {history.length === 0 
                ? 'У вас пока нет вопросов. Задайте первый после решения судоку!'
                : 'В этой категории пока нет вопросов'}
            </p>
          </div>
        ) : (
          <div className={styles.historyList}>
            {filteredHistory.map((item, index) => (
              <div key={item.id || index} className={styles.historyItem}>
                <div 
                  className={styles.itemHeader}
                  style={{ borderLeftColor: getCategoryColor(item.category) }}
                >
                  <div className={styles.itemDate}>
                    <span className={styles.itemIcon}>{getCategoryIcon(item.category)}</span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                  <div className={styles.itemStats}>
                    <span>⏱️ {formatTime(item.time)}</span>
                    <span>❌ {item.errors || 0}</span>
                    <span>💡 {item.hintsUsed || 0}</span>
                  </div>
                </div>
                <div className={styles.itemCategory} style={{ color: getCategoryColor(item.category) }}>
                  {item.category}
                </div>
                <div className={styles.itemQuestion}>
                  <span className={styles.questionLabel}>Вопрос:</span>
                  <span>"{item.question}"</span>
                </div>
                <div className={styles.itemAnswer}>
                  <span className={styles.answerLabel}>Ответ:</span>
                  <span>{item.answer}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <div className={styles.footer}>
            {!showConfirm ? (
              <button className={styles.clearButton} onClick={() => setShowConfirm(true)}>
                🗑 Очистить всю историю
              </button>
            ) : (
              <div className={styles.confirmDialog}>
                <p className={styles.confirmText}>
                  Вы уверены? Вся история вопросов будет удалена без возможности восстановления.
                </p>
                <div className={styles.confirmButtons}>
                  <button className={styles.cancelButton} onClick={() => setShowConfirm(false)}>
                    Отмена
                  </button>
                  <button className={styles.confirmClearButton} onClick={handleClearHistory}>
                    Да, очистить
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;