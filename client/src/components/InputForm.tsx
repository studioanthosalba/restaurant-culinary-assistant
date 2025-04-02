import React, { useState } from "react";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { sendToWebhook } from "@/lib/webhookApi";
import { useLanguage } from "@/context/LanguageContext";

interface InputFormProps {
  label: string;
  placeholder: string;
  optionType: string;
  maxLength?: number;
}

const InputForm: React.FC<InputFormProps> = ({
  label,
  placeholder,
  optionType,
  maxLength = 500,
}) => {
  const [input, setInput] = useState("");
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInput(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      return;
    }

    try {
      // Navigate to results page with loading state
      navigate("/results", { 
        replace: true, 
        state: { 
          isLoading: true, 
          optionType, 
          input 
        } 
      });
      
      const response = await sendToWebhook(optionType, input);
      
      // Navigate to results page with response data
      navigate("/results", { 
        replace: true, 
        state: { 
          isLoading: false, 
          result: response, 
          optionType,
          input
        } 
      });
    } catch (error) {
      // Navigate to results page with error
      navigate("/results", { 
        replace: true, 
        state: { 
          isLoading: false, 
          error: (error as Error).message, 
          optionType,
          input
        } 
      });
    }
  };

  return (
    <form className="bg-white rounded-lg shadow-md p-6" onSubmit={handleSubmit}>
      <div className="mb-6">
        <label htmlFor="input-field" className="block text-gray-700 mb-2">
          {label}
        </label>
        <div className="relative">
          <Textarea
            id="input-field"
            value={input}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px] resize-none"
            placeholder={placeholder}
            maxLength={maxLength}
          />
          <div className="text-right text-gray-500 text-sm mt-1">
            {input.length}/{maxLength}
          </div>
        </div>
      </div>
      <div className="text-right">
        <Button 
          type="submit" 
          className="bg-primary hover:bg-primary/80 text-white font-medium py-2 px-6 rounded-lg inline-flex items-center transition-colors"
        >
          {t.next}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </form>
  );
};

export default InputForm;
