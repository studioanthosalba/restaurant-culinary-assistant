import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import CulinaryStyles from "@/pages/CulinaryStyles";
import RecipeIdea from "@/pages/RecipeIdea";
import IngredientAnalyze from "@/pages/IngredientAnalyze";
import Results from "@/pages/Results";
import { LanguageProvider } from "@/context/LanguageContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/culinary-styles" component={CulinaryStyles} />
      <Route path="/recipe-idea" component={RecipeIdea} />
      <Route path="/ingredient-analyze" component={IngredientAnalyze} />
      <Route path="/results" component={Results} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router />
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
