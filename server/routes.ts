import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Store the most recent webhook result and its timestamp
  let lastWebhookResult: string | null = null;
  let resultTimestamp: number = Date.now();

  // Add WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Keep track of connected WebSocket clients
  const clients = new Set<WebSocket>();
  
  wss.on('connection', (ws: WebSocket) => {
    // Add client to the set
    clients.add(ws);
    console.log(`New WebSocket client connected. Total clients: ${clients.size}`);
    
    // Send current result if available
    if (lastWebhookResult) {
      try {
        ws.send(JSON.stringify({ 
          result: lastWebhookResult,
          timestamp: resultTimestamp
        }));
      } catch (error) {
        console.error('Error sending initial result to client:', error);
      }
    }
    
    // Handle messages from client (like ping/keepalive)
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        // If it's a ping, send a pong back
        if (message && message.type === 'ping') {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
              type: 'pong',
              timestamp: Date.now(),
              serverTime: new Date().toISOString()
            }));
          }
        }
      } catch (error) {
        // Ignore non-JSON messages
      }
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket client error:', error);
      try {
        if (ws.readyState !== WebSocket.CLOSED) {
          ws.close();
        }
      } catch (closeError) {
        console.error('Error closing WebSocket after error:', closeError);
      }
    });
    
    // Remove client when they disconnect
    ws.on('close', () => {
      clients.delete(ws);
      console.log(`WebSocket client disconnected. Remaining clients: ${clients.size}`);
    });
  });
  
  // Function to broadcast result to all connected clients
  const broadcastResult = (result: string) => {
    // Update timestamp for this result
    resultTimestamp = Date.now();
    
    console.log(`Broadcasting result to ${clients.size} connected clients`);
    
    const message = JSON.stringify({ 
      result,
      timestamp: resultTimestamp
    });
    
    let successCount = 0;
    
    clients.forEach((client: WebSocket) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
          successCount++;
        } catch (error) {
          console.error('Error sending message to client:', error);
        }
      }
    });
    
    console.log(`Successfully sent to ${successCount}/${clients.size} clients`);
  };

  // Health check route
  app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // GET endpoint to retrieve the most recent webhook result received from the user's server
  app.get('/api/webhook-result', (_req, res) => {
    if (lastWebhookResult) {
      return res.status(200).json({ 
        result: lastWebhookResult,
        timestamp: resultTimestamp // Use the timestamp when result was received instead of current time
      });
    } else {
      return res.status(404).json({ error: 'No result available yet. Please try again later.' });
    }
  });
  
  // Endpoint to clear the current result when starting a new request
  app.post('/api/clear-result', (_req, res) => {
    console.log('Clearing previous webhook result');
    lastWebhookResult = null;
    
    // Reset timestamp to current time so we can tell if a result is new
    resultTimestamp = Date.now();
    
    // Broadcast empty result to all clients to let them know the result was cleared
    try {
      const message = JSON.stringify({
        cleared: true,
        timestamp: resultTimestamp
      });
      
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(message);
          } catch (error) {
            console.error('Error sending clear message to client:', error);
          }
        }
      });
    } catch (error) {
      console.error('Error broadcasting clear message:', error);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Result cleared successfully',
      timestamp: resultTimestamp
    });
  });

  // Endpoint that receives the result from the user's server
  app.post('/api/webhook-result', (req: Request, res: Response) => {
    console.log('Received webhook result from user server:', JSON.stringify(req.body));
    
    try {
      // Extract the result from the request body
      const result = req.body?.result;
      
      // If result is not provided
      if (result === undefined) {
        console.error('Missing result in request body');
        return res.status(400).json({ 
          success: false, 
          message: 'Missing result in request body'
        });
      }

      // Store the result so it can be retrieved by the frontend
      lastWebhookResult = String(result);
      console.log('Stored webhook result:', lastWebhookResult);
      
      // Broadcast the result to all connected WebSocket clients
      broadcastResult(lastWebhookResult);
      
      // Return a success response
      return res.status(200).json({ 
        success: true, 
        message: 'Result received and stored successfully'
      });
    } catch (error) {
      console.error('Error processing webhook result:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to process webhook result'
      });
    }
  });
  


  return httpServer;
}
