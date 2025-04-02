import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ subtitle }) => {
  const { t } = useLanguage();
  
  return (
    <div className="relative">
      <div className="absolute right-0 top-0">
        <LanguageSwitcher />
      </div>
      <h1 className="text-primary text-3xl font-semibold mb-2 text-center">
        {t.appTitle}
      </h1>
      <p className="text-gray-600 text-center">
        {subtitle || t.appSubtitle}
      </p>
    </div>
  );
};

export default Header;
