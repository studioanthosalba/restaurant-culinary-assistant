import React from "react";
import { Link } from "wouter";
import PageLayout from "@/components/PageLayout";
import InputForm from "@/components/InputForm";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const CulinaryStyles: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center text-gray-600 mb-4">
          <ChevronLeft className="h-5 w-5 mr-1" />
          {t.culinaryStylesTitle}
        </Link>
        
        <p className="text-gray-700 mb-6">
          {t.culinaryStylesDesc}
        </p>

        <InputForm
          label={t.culinaryStylesLabel}
          placeholder={t.culinaryStylesPlaceholder}
          optionType="culinaryStyles"
        />
      </div>
    </PageLayout>
  );
};

export default CulinaryStyles;
