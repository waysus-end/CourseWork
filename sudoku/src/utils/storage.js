// ========== КЛЮЧИ ДЛЯ ХРАНИЛИЩА ==========
export const STORAGE_KEYS = {
  USER_SIGN: 'user_sign',           // знак зодиака
  HISTORY: 'history',                // история вопросов
  HAS_VISITED: 'has_visited'         // был ли на приветственной
};

// ========== ЗНАК ЗОДИАКА ==========
export const saveUserSign = (signId) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SIGN, signId);
    return true;
  } catch (error) {
    console.error('Ошибка сохранения знака:', error);
    return false;
  }
};

export const loadUserSign = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.USER_SIGN);
  } catch (error) {
    console.error('Ошибка загрузки знака:', error);
    return null;
  }
};

// ========== ПРИВЕТСТВЕННАЯ СТРАНИЦА ==========
export const hasVisitedWelcome = () => {
  try {
    return localStorage.getItem(STORAGE_KEYS.HAS_VISITED) === 'true';
  } catch (error) {
    return false;
  }
};

export const markWelcomeVisited = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.HAS_VISITED, 'true');
  } catch (error) {
    console.error('Ошибка:', error);
  }
};

// ========== СБРОС АККАУНТА ==========
export const resetAccount = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_SIGN);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.HAS_VISITED);
    return true;
  } catch (error) {
    console.error('Ошибка сброса аккаунта:', error);
    return false;
  }
};

// ========== ИСТОРИЯ ВОПРОСОВ ==========
export const addHistoryEntry = (entry) => {
  try {
    const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
    const newEntry = {
      ...entry,
      id: Date.now(),
      date: new Date().toISOString()
    };
    history.push(newEntry);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Ошибка сохранения истории:', error);
    return false;
  }
};

export const loadHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    return [];
  }
};

export const clearHistory = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, '[]');
    return true;
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
    return false;
  }
};