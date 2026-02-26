/**
 * Chat History Storage Utilities
 * Manages localStorage for Rebecca chat history
 */

const STORAGE_PREFIX = 'rebecca_chat_';
const STORAGE_VERSION = 'v1';

/**
 * Get chat history for a specific patient
 */
export const getChatHistory = (patientId) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${patientId}`;
    const data = localStorage.getItem(storageKey);
    
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    
    // Validate structure
    if (!Array.isArray(parsed)) return [];
    
    return parsed;
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

/**
 * Save chat history for a specific patient
 */
export const saveChatHistory = (patientId, messages) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${patientId}`;
    localStorage.setItem(storageKey, JSON.stringify(messages));
    return true;
  } catch (error) {
    console.error('Error saving chat history:', error);
    
    // Handle quota exceeded error
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded. Consider clearing old chats.');
    }
    
    return false;
  }
};

/**
 * Clear chat history for a specific patient
 */
export const clearChatHistory = (patientId) => {
  try {
    const storageKey = `${STORAGE_PREFIX}${patientId}`;
    localStorage.removeItem(storageKey);
    return true;
  } catch (error) {
    console.error('Error clearing chat history:', error);
    return false;
  }
};

/**
 * Get all patient IDs with chat history
 */
export const getAllChatPatients = () => {
  try {
    const patients = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        const patientId = key.replace(STORAGE_PREFIX, '');
        patients.push(patientId);
      }
    }
    
    return patients;
  } catch (error) {
    console.error('Error getting chat patients:', error);
    return [];
  }
};

/**
 * Clear all chat histories
 */
export const clearAllChatHistories = () => {
  try {
    const patients = getAllChatPatients();
    patients.forEach(patientId => clearChatHistory(patientId));
    return true;
  } catch (error) {
    console.error('Error clearing all chat histories:', error);
    return false;
  }
};

/**
 * Export chat history as JSON
 */
export const exportChatHistory = (patientId, patientName) => {
  try {
    const messages = getChatHistory(patientId);
    
    const exportData = {
      version: STORAGE_VERSION,
      exportDate: new Date().toISOString(),
      patient: {
        id: patientId,
        name: patientName,
      },
      messages,
      messageCount: messages.length,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rebecca-chat-${patientName.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting chat history:', error);
    return false;
  }
};

/**
 * Get storage usage statistics
 */
export const getStorageStats = () => {
  try {
    let totalSize = 0;
    const patientStats = [];
    
    const patients = getAllChatPatients();
    
    patients.forEach(patientId => {
      const messages = getChatHistory(patientId);
      const size = new Blob([JSON.stringify(messages)]).size;
      
      totalSize += size;
      patientStats.push({
        patientId,
        messageCount: messages.length,
        sizeBytes: size,
        sizeKB: (size / 1024).toFixed(2),
      });
    });
    
    return {
      totalPatients: patients.length,
      totalSizeBytes: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      patients: patientStats,
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};
