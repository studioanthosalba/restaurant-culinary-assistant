import React from "react";
import { useLocation } from "wouter";
import { ChevronRight } from "lucide-react";

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const OptionCard: React.FC<OptionCardProps> = ({ title, description, icon, path }) => {
  const [, navigate] = useLocation();

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-shadow"
      data-option={path.replace('/', '')}
    >
      <div className="bg-[#FFC8BC] p-4 rounded-full mb-4">
        {icon}
      </div>
      <h2 className="text-xl font-semibold mb-2 text-center">{title}</h2>
      <p className="text-gray-600 text-center mb-4">{description}</p>
      <button 
        className="text-primary font-medium flex items-center mt-auto"
        onClick={() => navigate(path)}
      >
        Select <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
};

export default OptionCard;
