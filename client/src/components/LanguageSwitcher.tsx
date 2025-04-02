import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Language } from '@/lib/translations';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'it' : 'en';
    setLanguage(newLanguage);
  };

  return (
    <Button 
      variant="ghost" 
      className="p-2" 
      onClick={toggleLanguage}
      aria-label={`Switch to ${language === 'en' ? 'Italian' : 'English'}`}
    >
      {language === 'en' ? '🇮🇹' : '🇬🇧'}
    </Button>
  );
};

export default LanguageSwitcher;