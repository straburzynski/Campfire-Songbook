export const saveItemToLocalStorage = (key, value): void => localStorage.setItem(key, value);
export const getItemFromLocalStorage = (key): string | null => localStorage.getItem(key);
export const removeItemFromLocalStorage = (key): void => localStorage.removeItem(key);
