let idCounter = 0;
export const generateUniqueId = (prefix: string): string => {
  return `${prefix}-${++idCounter}`;
};
