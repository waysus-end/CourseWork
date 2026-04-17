import { supabase, getUserId } from './supabase';

// ========== ЗНАК ЗОДИАКА ==========
export const saveUserSign = async (userId, sign) => {
  try {
    const { error } = await supabase
      .from('users')
      .upsert({ 
        id: userId, 
        sign: sign,
        last_active: new Date().toISOString()
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Ошибка сохранения знака:', error);
    return false;
  }
};

export const loadUserSign = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('sign')
      .eq('id', userId)
      .maybeSingle();
    
    if (error) throw error;
    return data?.sign || null;
  } catch (error) {
    console.error('Ошибка загрузки знака:', error);
    return null;
  }
};

// ========== ИСТОРИЯ ==========
export const addHistoryEntry = async (userId, entry) => {
  try {
    // Экранируем специальные символы в вопросах и ответах
    const safeQuestion = entry.question.replace(/['"\\]/g, '');
    const safeAnswer = entry.answer.replace(/['"\\]/g, '');
    
    const { error } = await supabase
      .from('history')
      .insert({
        user_id: userId,
        category: entry.category,
        difficulty: entry.difficulty,
        question: safeQuestion,
        answer: safeAnswer,
        time_seconds: entry.time,
        errors: entry.errors,
        hints_used: entry.hintsUsed
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Ошибка сохранения истории:', error);
    return false;
  }
};

export const loadHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    
    // Преобразуем поля для совместимости с компонентами
    return (data || []).map(item => ({
      id: item.id,
      category: item.category,
      difficulty: item.difficulty,
      question: item.question,
      answer: item.answer,
      time: item.time_seconds,
      errors: item.errors,
      hintsUsed: item.hints_used,
      date: item.date
    }));
  } catch (error) {
    console.error('Ошибка загрузки истории:', error);
    return [];
  }
};

export const clearHistory = async (userId) => {
  try {
    // Простой DELETE запрос
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('Ошибка DELETE:', error);
      throw error;
    }
    
    console.log('История очищена для пользователя:', userId);
    return true;
  } catch (error) {
    console.error('Ошибка очистки истории:', error);
    return false;
  }
};

export const getHistoryStats = async (userId) => {
  try {
    const history = await loadHistory(userId);
    return {
      total: history.length,
      daily: history.filter(h => h.category === 'РАДОСТИ ДНЯ').length,
      horizons: history.filter(h => h.category === 'ГОРИЗОНТЫ').length,
      heart: history.filter(h => h.category === 'СЕРДЦЕ И СУДЬБА').length
    };
  } catch (error) {
    console.error('Ошибка статистики:', error);
    return { total: 0, daily: 0, horizons: 0, heart: 0 };
  }
};