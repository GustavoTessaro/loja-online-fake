// src/utils/localStorage.js
export const loadState = (key) => {
  try {
    const serialized = localStorage.getItem(key);
    if (!serialized) return undefined;
    return JSON.parse(serialized);
  } catch (e) {
    console.error('loadState error', e);
    return undefined;
  }
};

export const saveState = (key, state) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (e) {
    console.error('saveState error', e);
  }
};
