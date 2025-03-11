// Mock implementation for next-intl
export function useTranslations() {
  // Simple function that returns the key as is
  return (key) => key;
}

export function useLocale() {
  // Return default locale
  return 'en';
}