import React from "react";
import PageLayout from "@/components/PageLayout";
import OptionCard from "@/components/OptionCard";
import { Utensils, FileText, Beaker } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Home: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <PageLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OptionCard
          title={t.culinaryStylesTitle}
          description={t.culinaryStylesDesc}
          icon={<Utensils className="h-8 w-8 text-primary" />}
          path="/culinary-styles"
        />
        
        <OptionCard
          title={t.recipeIdeaTitle}
          description={t.recipeIdeaDesc}
          icon={<FileText className="h-8 w-8 text-primary" />}
          path="/recipe-idea"
        />
        
        <OptionCard
          title={t.ingredientAnalyzeTitle}
          description={t.ingredientAnalyzeDesc}
          icon={<Beaker className="h-8 w-8 text-primary" />}
          path="/ingredient-analyze"
        />
      </div>
    </PageLayout>
  );
};

export default Home;
