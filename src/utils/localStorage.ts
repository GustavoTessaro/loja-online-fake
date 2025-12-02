export const loadState = (key: string) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) return undefined;
    return JSON.parse(serialized);
  } catch (error) {
    console.error(`Erro ao carregar estado de ${key}:`, error);
    return undefined;
  }
};

export const saveState = (key: string, state: any) => {
  try {
    const serialized = JSON.stringify(state);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error(`Erro ao salvar estado em ${key}:`, error);
  }
};
