const PIN_VERIFY_KEY = 'pin-verified';

export const setPinVerified = () => {
  sessionStorage.setItem(PIN_VERIFY_KEY, Date.now().toString());
};

export const isPinVerified = (limitMinutes = 10): boolean => {
  const stored = sessionStorage.getItem(PIN_VERIFY_KEY);
  if (!stored) return false;

  const verifiedAt = Number(stored);
  return Date.now() - verifiedAt <= limitMinutes * 60 * 50; // 유효기간 : 10분
};

export const clearPinVerified = () => {
  sessionStorage.removeItem(PIN_VERIFY_KEY);
};
