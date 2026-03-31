import React, { useState } from 'react';
import { addHistoryEntry } from '../utils/storage';
import zodiacData from '../data/zodiacSigns.json';
import styles from '../styles/AnswerPage.module.css';

const AnswerPage = ({ 
  userSignId,           // id знака (например, 'aries')
  category,             // объект категории { name, difficulty, icon }
  gameData,             // { time, errors, hintsUsed }
  onBackToMenu 
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Получаем информацию о знаке
  const signInfo = zodiacData.signs.find(s => s.id === userSignId);
  const signName = signInfo?.name || userSignId;
  const signSymbol = signInfo?.symbol || '⭐';

  // Функция для получения ответа на основе всех параметров
  const generateAnswer = () => {
    if (!question.trim()) {
      alert('Пожалуйста, задайте вопрос');
      return;
    }

    setIsLoading(true);

    // Имитация загрузки (для атмосферы)
    setTimeout(() => {
      const newAnswer = getPersonalizedAnswer();
      setAnswer(newAnswer);
      setIsAnswered(true);
      
      // Сохраняем в историю
      addHistoryEntry({
        category: category.name,
        difficulty: category.difficulty,
        question: question,
        answer: newAnswer,
        time: gameData.time,
        errors: gameData.errors,
        hintsUsed: gameData.hintsUsed,
        signId: userSignId
      });
      
      setIsLoading(false);
    }, 800);
  };

  // Генерация персонализированного ответа
  const getPersonalizedAnswer = () => {
    // Оценка качества прохождения (0-100)
    const qualityScore = calculateQualityScore();
    
    // Базовые ответы в зависимости от категории
    const categoryAnswers = {
      daily: {
        positive: [
          "Да, это хорошая идея! ✨",
          "Определённо да! Звёзды говорят 'да'",
          "Сегодня удачный день для этого",
          "Почему бы и нет? Действуй!"
        ],
        neutral: [
          "Возможно, но не торопись",
          "Туманно, но шансы есть",
          "Подумай ещё раз, ответ рядом",
          "Звёзды ещё не определились"
        ],
        negative: [
          "Лучше повременить",
          "Сейчас не лучшее время",
          "Ответ скорее отрицательный",
          "Попробуй в другой день"
        ]
      },
      horizons: {
        positive: [
          "Да, это откроет новые горизонты! 🌅",
          "Путь ясен — действуй смелее",
          "Звёзды благословляют этот шаг",
          "Удачи сопутствуют твоим начинаниям"
        ],
        neutral: [
          "Возможно, но нужна подготовка",
          "Ответ придёт, когда будешь готов",
          "Не торопи события, всему своё время",
          "Шансы 50 на 50, решай сам"
        ],
        negative: [
          "Сейчас не время для этого",
          "Путь закрыт, поищи другой",
          "Звёзды советуют подождать",
          "Лучше отложи до лучших времён"
        ]
      },
      heart: {
        positive: [
          "Сердце подсказывает верный путь 💖",
          "Да, чувства не обманывают",
          "Это твоя судьба, не бойся",
          "Вселенная говорит 'да'"
        ],
        neutral: [
          "Прислушайся к себе в тишине",
          "Возможно, но не торопи чувства",
          "Ответ внутри тебя, просто поверь",
          "Звёзды видят твой путь, но не спешат"
        ],
        negative: [
          "Сейчас не время для этого",
          "Береги сердце, подожди",
          "Ответ 'нет', но всё изменится",
          "Лучше отпустить и двигаться дальше"
        ]
      }
    };

    // Выбираем базу ответов для категории
    let answerPool;
    if (category.id === 'daily') answerPool = categoryAnswers.daily;
    else if (category.id === 'horizons') answerPool = categoryAnswers.horizons;
    else answerPool = categoryAnswers.heart;

    // Определяем тип ответа на основе качества прохождения
    let answerType;
    if (qualityScore >= 70) answerType = 'positive';
    else if (qualityScore >= 40) answerType = 'neutral';
    else answerType = 'negative';

    // Выбираем случайный ответ из пула
    let selectedAnswer = answerPool[answerType][
      Math.floor(Math.random() * answerPool[answerType].length)
    ];

    // Добавляем персонализацию по знаку зодиака
    selectedAnswer = addZodiacFlavor(selectedAnswer, signInfo);

    return selectedAnswer;
  };

  // Оценка качества прохождения (0-100)
  const calculateQualityScore = () => {
    let score = 100;
    
    // Штраф за ошибки
    score -= gameData.errors * 5;
    
    // Штраф за подсказки
    score -= gameData.hintsUsed * 8;
    
    // Штраф за время (норма — 3 минуты для лёгкого, 5 для среднего, 7 для сложного)
    let expectedTime;
    switch (category.difficulty) {
      case 'easy': expectedTime = 180; break;
      case 'medium': expectedTime = 300; break;
      case 'hard': expectedTime = 420; break;
      default: expectedTime = 300;
    }
    
    if (gameData.time > expectedTime) {
      const overtime = gameData.time - expectedTime;
      score -= Math.min(30, overtime / 10);
    }
    
    // Бонус за быстрое решение
    if (gameData.time < expectedTime / 2) {
      score += 15;
    }
    
    return Math.max(0, Math.min(100, score));
  };

  // Добавление "вкуса" знака зодиака
  const addZodiacFlavor = (answer, sign) => {
    if (!sign) return answer;
    
    const flavors = {
      fire: " Твой огонь сейчас ярко горит!",
      earth: " Прислушайся к своей практичности.",
      air: " Доверься своей интуиции и логике.",
      water: " Плыви по течению, оно знает путь."
    };
    
    const elementFlavor = flavors[sign.element];
    if (elementFlavor && Math.random() > 0.6) {
      return answer + elementFlavor;
    }
    
    return answer;
  };

  // Новая игра (с той же категорией)
  const handlePlayAgain = () => {
    onBackToMenu(); // Пока возвращаемся в меню, потом можно добавить рестарт
  };

  // Форматирование времени
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button className={styles.backButton} onClick={onBackToMenu}>
          ← Назад в меню
        </button>

        <div className={styles.header}>
          <div className={styles.symbol}>🔮</div>
          <h1 className={styles.title}>Цифры судьбы</h1>
          <div className={styles.signBadge}>
            {signSymbol} {signName}
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>📋</span>
            <span>{category.name}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>⏱️</span>
            <span>{formatTime(gameData.time)}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>❌</span>
            <span>{gameData.errors}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statIcon}>💡</span>
            <span>{gameData.hintsUsed}</span>
          </div>
        </div>

        {!isAnswered ? (
          <div className={styles.questionSection}>
            <p className={styles.questionLabel}>
              Какое желание или вопрос ты хочешь задать?
            </p>
            <textarea
              className={styles.questionInput}
              placeholder="Например: Стоит ли мне менять работу?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
            />
            <button
              className={styles.askButton}
              onClick={generateAnswer}
              disabled={isLoading}
            >
              {isLoading ? '✨ Гадаю...' : 'Получить ответ →'}
            </button>
          </div>
        ) : (
          <div className={styles.answerSection}>
            <div className={styles.questionDisplay}>
              <span className={styles.questionQuote}>"</span>
              {question}
              <span className={styles.questionQuote}>"</span>
            </div>
            <div className={styles.answerCard}>
              <div className={styles.answerSymbol}>🔮</div>
              <p className={styles.answerText}>{answer}</p>
              <div className={styles.answerFooter}>
                <span>✨ {signName} ✨</span>
              </div>
            </div>
            <div className={styles.answerActions}>
              <button className={styles.newQuestionButton} onClick={() => {
                setIsAnswered(false);
                setAnswer('');
                setQuestion('');
              }}>
                Задать новый вопрос
              </button>
              <button className={styles.playAgainButton} onClick={handlePlayAgain}>
                🎮 Другая категория
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnswerPage;