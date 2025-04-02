/**
 * Translations for the Restaurant Culinary Assistant
 */

export type Language = 'en' | 'it';

export interface Translations {
  // Common
  appTitle: string;
  appSubtitle: string;
  tryAgain: string;
  newRecipe: string;
  processing: string;
  
  // Home Page
  culinaryStylesTitle: string;
  culinaryStylesDesc: string;
  recipeIdeaTitle: string;
  recipeIdeaDesc: string;
  ingredientAnalyzeTitle: string;
  ingredientAnalyzeDesc: string;
  
  // Culinary Styles Page
  culinaryStylesLabel: string;
  culinaryStylesPlaceholder: string;
  
  // Recipe Idea Page
  recipeIdeaLabel: string;
  recipeIdeaPlaceholder: string;
  
  // Ingredient Analyze Page
  ingredientAnalyzeLabel: string;
  ingredientAnalyzePlaceholder: string;
  
  // Results Page
  yourCulinaryStyle: string;
  yourRecipe: string;
  yourIngredientAnalysis: string;
  yourCulinaryResult: string;
  
  // Buttons
  select: string;
  next: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    appTitle: 'Restaurant Culinary Assistant',
    appSubtitle: 'Explore new culinary styles, create recipes, and analyze ingredients',
    tryAgain: 'Try Again',
    newRecipe: 'New Recipe',
    processing: 'The example is being processed. The result will appear here shortly.',
    
    // Home Page
    culinaryStylesTitle: 'Create New Culinary Styles',
    culinaryStylesDesc: 'Generate innovative culinary styles based on your preferences',
    recipeIdeaTitle: 'Create Recipe from an Idea',
    recipeIdeaDesc: 'Transform your food idea into a detailed recipe',
    ingredientAnalyzeTitle: 'Ingredient Analyze',
    ingredientAnalyzeDesc: 'Get detailed analysis about ingredients and their uses',
    
    // Culinary Styles Page
    culinaryStylesLabel: 'Type in your culinary styles, separate by comma if you have more than one',
    culinaryStylesPlaceholder: 'e.g. Italian fusion, Modern Korean, etc.',
    
    // Recipe Idea Page
    recipeIdeaLabel: 'Describe your recipe idea',
    recipeIdeaPlaceholder: 'e.g. A savory breakfast dish with eggs and avocado',
    
    // Ingredient Analyze Page
    ingredientAnalyzeLabel: 'Enter the ingredients you want to analyze',
    ingredientAnalyzePlaceholder: 'e.g. turmeric, saffron, star anise',
    
    // Results Page
    yourCulinaryStyle: 'Your Culinary Style',
    yourRecipe: 'Your Recipe',
    yourIngredientAnalysis: 'Your Ingredient Analysis',
    yourCulinaryResult: 'Your Culinary Result',
    
    // Buttons
    select: 'Select',
    next: 'Next'
  },
  it: {
    // Common
    appTitle: 'Assistente Culinario per Ristoranti',
    appSubtitle: 'Esplora nuovi stili culinari, crea ricette e analizza ingredienti',
    tryAgain: 'Riprova',
    newRecipe: 'Nuova Ricetta',
    processing: 'L\'esempio è in fase di elaborazione. Il risultato apparirà qui a breve.',
    
    // Home Page
    culinaryStylesTitle: 'Crea Nuovi Stili Culinari',
    culinaryStylesDesc: 'Genera stili culinari innovativi in base alle tue preferenze',
    recipeIdeaTitle: 'Crea Ricetta da un\'Idea',
    recipeIdeaDesc: 'Trasforma la tua idea di cibo in una ricetta dettagliata',
    ingredientAnalyzeTitle: 'Analisi Ingredienti',
    ingredientAnalyzeDesc: 'Ottieni un\'analisi dettagliata degli ingredienti e dei loro usi',
    
    // Culinary Styles Page
    culinaryStylesLabel: 'Inserisci i tuoi stili culinari, separati da virgola se ne hai più di uno',
    culinaryStylesPlaceholder: 'es. Fusion italiana, Coreana moderna, ecc.',
    
    // Recipe Idea Page
    recipeIdeaLabel: 'Descrivi la tua idea di ricetta',
    recipeIdeaPlaceholder: 'es. Un piatto salato per la colazione con uova e avocado',
    
    // Ingredient Analyze Page
    ingredientAnalyzeLabel: 'Inserisci gli ingredienti che vuoi analizzare',
    ingredientAnalyzePlaceholder: 'es. curcuma, zafferano, anice stellato',
    
    // Results Page
    yourCulinaryStyle: 'Il Tuo Stile Culinario',
    yourRecipe: 'La Tua Ricetta',
    yourIngredientAnalysis: 'La Tua Analisi degli Ingredienti',
    yourCulinaryResult: 'Il Tuo Risultato Culinario',
    
    // Buttons
    select: 'Seleziona',
    next: 'Avanti'
  }
};