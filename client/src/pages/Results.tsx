import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw, Plus, Wifi, WifiOff } from "lucide-react";
import { sendToWebhook } from "@/lib/webhookApi";
import { useLanguage } from "@/context/LanguageContext";
import { useWebSocket } from "@/hooks/useWebSocket";

interface LocationState {
  isLoading?: boolean;
  result?: string;
  error?: string;
  optionType?: string;
  input?: string;
}

const Results: React.FC = () => {
  const { t } = useLanguage();
  const [location, navigate] = useLocation();
  const [state, setState] = useState<LocationState>({
    isLoading: true,
    result: undefined,
    error: undefined,
    optionType: undefined,
    input: undefined
  });
  
  // Use the WebSocket hook for real-time updates
  const { lastMessage, status, reconnect, isConnected } = useWebSocket();
  
  // Update state with WebSocket message if it's received
  useEffect(() => {
    if (lastMessage) {
      console.log('Received WebSocket message:', lastMessage);
      // Only update if we're in loading state or if the result is different
      setState(prev => {
        // Don't update if we already have the exact same result
        if (prev.result === lastMessage) {
          return prev;
        }
        
        // Make sure we have a valid result (not an empty string or special marker)
        if (lastMessage && lastMessage.trim() && lastMessage !== "REQUEST_SENT") {
          return {
            ...prev,
            isLoading: false,
            result: lastMessage
          };
        }
        
        return prev;
      });
    }
  }, [lastMessage]);

  // Get the state from the location
  useEffect(() => {
    const currentState = window.history.state;
    if (currentState) {
      setState(currentState);
      
      // If loading is true, make the API call
      if (currentState.isLoading && currentState.optionType && currentState.input) {
        const fetchData = async () => {
          try {
            const response = await sendToWebhook(currentState.optionType, currentState.input!);
            
            // If we get our special "REQUEST_SENT" marker, keep the loading state active
            // The actual result will come via WebSocket when ready
            if (response === "REQUEST_SENT") {
              console.log("Request sent to server, waiting for response via WebSocket...");
              // Keep the loading state active
              setState({
                ...currentState,
                isLoading: true,
                result: "",
                error: null
              });
            } else {
              // Got a direct response (error or fallback)
              setState({
                ...currentState,
                isLoading: false,
                result: response
              });
            }
          } catch (error) {
            console.error("Error sending webhook request:", error);
            setState({
              ...currentState,
              isLoading: false,
              error: (error as Error).message
            });
          }
        };
        
        fetchData();
      }
    }
  }, [location]);

  const handleTryAgain = () => {
    if (state.optionType) {
      switch (state.optionType) {
        case "culinaryStyles":
          navigate("/culinary-styles");
          break;
        case "recipeIdea":
          navigate("/recipe-idea");
          break;
        case "ingredientAnalyze":
          navigate("/ingredient-analyze");
          break;
        default:
          navigate("/");
      }
    } else {
      navigate("/");
    }
  };

  const handleNewRecipe = () => {
    navigate("/");
  };

  const getPageTitle = () => {
    if (state.optionType) {
      switch (state.optionType) {
        case "culinaryStyles":
          return t.yourCulinaryStyle;
        case "recipeIdea":
          return t.yourRecipe;
        case "ingredientAnalyze":
          return t.yourIngredientAnalysis;
        default:
          return t.yourCulinaryResult;
      }
    }
    return t.yourCulinaryResult;
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="flex items-center text-gray-600 mb-4">
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>{getPageTitle()}</span>
        </Link>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Connection Status */}
          <div className="flex items-center justify-end mb-2 text-xs text-gray-500">
            {isConnected ? (
              <div className="flex items-center text-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                <span>Live updates enabled</span>
              </div>
            ) : (
              <div className="flex items-center text-amber-600">
                <WifiOff className="h-3 w-3 mr-1" />
                <span>Waiting for connection...</span>
              </div>
            )}
          </div>
          
          {/* Loading State */}
          {state.isLoading && (
            <div className="py-10 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-[#FF9F7F] w-3 h-3 rounded-full mx-1 animate-pulse"></div>
                <div className="bg-[#FF9F7F] w-3 h-3 rounded-full mx-1 animate-pulse delay-75"></div>
                <div className="bg-[#FF9F7F] w-3 h-3 rounded-full mx-1 animate-pulse delay-150"></div>
              </div>
              <p className="text-gray-600 text-center font-medium">
                {t.processing}
              </p>
              <p className="text-gray-500 mt-2">
                {isConnected ? 
                  "Please wait while we're processing your request..." : 
                  "Connecting to server for live updates..."}
              </p>
              
              {/* Loading spinner */}
              <div className="mt-6 flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary my-4"></div>
                <p className="text-gray-500 text-sm">
                  Your request is being processed by the server
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  (This may take 1-2 minutes)
                </p>
              </div>
              
              {/* Realtime connection status */}
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-gray-100">
                <div className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                <span className="text-xs font-medium">
                  {isConnected ? 'Connected - waiting for results' : 'Connecting...'}
                </span>
              </div>
            </div>
          )}
          
          {/* Results Container */}
          {!state.isLoading && (
            <div className="whitespace-pre-wrap">
              {state.error ? `Error: ${state.error}` : state.result}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-between mt-6 gap-4">
            <Button 
              variant="outline" 
              className="border border-primary text-primary font-medium inline-flex items-center hover:bg-primary/10 transition-colors"
              onClick={handleTryAgain}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {t.tryAgain}
            </Button>
            
            <Button 
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium inline-flex items-center transition-colors"
              onClick={handleNewRecipe}
            >
              {t.newRecipe}
              <Plus className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Results;
