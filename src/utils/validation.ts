// Validation rules for token creation
export const validateTokenName = (name: string): string | null => {
  if (!name.trim()) return "Token name is required";
  if (name.length < 3) return "Token name must be at least 3 characters";
  if (name.length > 50) return "Token name must be less than 50 characters";
  if (!/^[a-zA-Z0-9\s]+$/.test(name)) return "Token name can only contain letters, numbers, and spaces";
  return null;
};

export const validateTokenSymbol = (symbol: string): string | null => {
  if (!symbol.trim()) return "Token symbol is required";
  if (symbol.length < 2 || symbol.length > 5) return "Token symbol must be 2-5 characters";
  if (!/^[A-Z0-9$]+$/.test(symbol)) return "Token symbol must be uppercase letters, numbers, or $";
  return null;
};

export const validateSupply = (supply: string): string | null => {
  const num = Number(supply);
  if (!supply) return "Initial supply is required";
  if (isNaN(num) || !Number.isInteger(num)) return "Supply must be a whole number";
  if (num <= 0) return "Supply must be greater than 0";
  if (num > Number.MAX_SAFE_INTEGER) return "Supply is too large";
  return null;
};

export const validateDecimals = (decimals: string): string | null => {
  const num = Number(decimals);
  if (!decimals) return "Decimals is required";
  if (isNaN(num) || !Number.isInteger(num)) return "Decimals must be a whole number";
  if (num < 0 || num > 18) return "Decimals must be between 0 and 18";
  return null;
};