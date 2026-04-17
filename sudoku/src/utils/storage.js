import * as supabase from './supabaseStorage';
import { getUserId } from './supabase';

// ========== КЛЮЧИ ==========
export const STORAGE_KEYS = {
  USER_SIGN: 'user_sign',
  HAS_VISITED: 'has_visited'
};

// ========== ЗНАК ЗОДИАКА ==========
export const saveUserSign = async (signId) => {
  try {
    const userId = getUserId();
    const result = await supabase.saveUserSign(userId, signId);
    if (result) {
      localStorage.setItem(STORAGE_KEYS.USER_SIGN, signId);
    }
    return result;
  } catch (error) {
    console.error('Ошибка сохранения знака:', error);
    return false;
  }
};

export const loadUserSign = async () => {
  try {
    // Сначала пробуем из localStorage
    let sign = localStorage.getItem(STORAGE_KEYS.USER_SIGN);
    if (sign) return sign;
    
    // Если нет — из Supabase
    const userId = getUserId();
    sign = await supabase.loadUserSign(userId);
    if (sign) {
      localStorage.setItem(STORAGE_KEYS.USER_SIGN, sign);
    }
    return sign;
  } catch (error) {
    console.error('Ошибка загрузки знака:', error);
    return null;
  }
};

// ========== ПРИВЕТСТВИЕ ==========
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

// ========== СБРОС ==========
export const resetAccount = async () => {
  try {
    const userId = getUserId();
    
    // Очищаем историю в Supabase
    await supabase.clearHistory(userId);
    
    // Очищаем localStorage
    localStorage.removeItem(STORAGE_KEYS.USER_SIGN);
    localStorage.removeItem(STORAGE_KEYS.HAS_VISITED);
    localStorage.removeItem('supabase_user_id');
    
    return true;
  } catch (error) {
    console.error('Ошибка сброса аккаунта:', error);
    return false;
  }
};

// ========== ИСТОРИЯ ==========
export const addHistoryEntry = async (entry) => {
  try {
    const userId = getUserId();
    return await supabase.addHistoryEntry(userId, entry);
  } catch (error) {
    console.error('Ошибка добавления истории:', error);
    return false;
  }
};

export const loadHistory = async () => {
  try {
    const userId = getUserId();
    return await supabase.loadHistory(userId);
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    const userId = getUserId();
    return await supabase.clearHistory(userId);
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
    return false;
  }
};

export const getHistoryStats = async () => {
  try {
    const userId = getUserId();
    return await supabase.getHistoryStats(userId);
  } catch (error) {
    console.error('Ошибка статистики:', error);
    return { total: 0, daily: 0, horizons: 0, heart: 0 };
  }
};