/**
 * Webhook API utilities for the Restaurant Culinary Assistant
 */

// User's webhook URL (where we send the user input)
const WEBHOOK_URL = "https://hook.eu2.make.com/v5to09graruetfpwk4o8r2wy38tgx7t0";

// OUR webhook endpoint (where we check for results)
const RESULT_ENDPOINT = "/api/webhook-result";

/**
 * Generates a unique request ID
 */
export const generateRequestId = (): string => {
  return 'req_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

/**
 * Sends data to the webhook and waits for the result
 * @param optionType - The type of option selected (culinaryStyles, recipeIdea, ingredientAnalyze)
 * @param userInput - The input provided by the user
 * @returns The response from the webhook as text
 */
export const sendToWebhook = async (optionType: string, userInput: string): Promise<string> => {
  const requestId = generateRequestId();
  
  // First, clear any previous result to avoid showing stale data
  try {
    await fetch('/api/clear-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error clearing previous result:", error);
  }
  
  const data = {
    requestId,
    optionType,
    userInput,
    // Including our callback URL so the server knows where to send the result
    callbackUrl: window.location.origin + RESULT_ENDPOINT
  };

  try {
    // Step 1: Send the user input to the user's webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    // If server responds with "Accepted", we know it received the request
    const responseText = await response.text();
    console.log("Webhook response:", responseText);
    
    // Step 2: Poll our endpoint to get the result sent by the server
    // Wait briefly to allow the server to process and send the result
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return immediately with a loading message
    // We won't actually return any result directly from this function
    // Instead, the WebSocket connection will receive the result when it's ready
    console.log("Request sent to webhook. Waiting for server to process and respond...");
    
    // We'll immediately return to show the loading state
    // The actual result will come via WebSocket when ready
    return "REQUEST_SENT";
  } catch (error) {
    console.error("Error communicating with webhook:", error);
    return `Error: Could not connect to the webhook. Please try again later.`;
  }
};
