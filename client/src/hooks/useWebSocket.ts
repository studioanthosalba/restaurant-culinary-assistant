import { useState, useEffect, useCallback, useRef } from 'react';

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface UseWebSocketOptions {
  autoReconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    autoReconnect = true,
    reconnectInterval = 3000,
    maxReconnectAttempts = 10 // Increased max attempts
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const lastProcessedMessageRef = useRef('');
  const timestampRef = useRef(Date.now());

  // Initialize WebSocket connection
  const connectWebSocket = useCallback(() => {
    // Close any existing socket
    if (socket) {
      socket.close();
    }

    // Create WebSocket URL using current protocol and host
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    console.log(`Connecting to WebSocket at ${wsUrl}`);

    try {
      const newSocket = new WebSocket(wsUrl);
      setSocket(newSocket);
      setStatus('connecting');

      // Handle socket events
      newSocket.onopen = () => {
        console.log('WebSocket connected');
        setStatus('connected');
        reconnectAttemptsRef.current = 0;
        
        // Reset timestamp when connected to avoid processing old messages
        timestampRef.current = Date.now();
      };

      newSocket.onmessage = (event) => {
        try {
          console.log('WebSocket message received:', event.data);
          
          // Update timestamp when message is received
          timestampRef.current = Date.now();
          
          // Try to parse as JSON first
          try {
            const data = JSON.parse(event.data);
            if (data && data.result) {
              // Avoid duplicates by checking against the last processed message
              if (data.result !== lastProcessedMessageRef.current) {
                lastProcessedMessageRef.current = data.result;
                setLastMessage(data.result);
              }
              return;
            }
          } catch (jsonError) {
            // Not JSON or invalid JSON, treat as plain text
          }
          
          // If we get here, it wasn't valid JSON with a result field,
          // so just use the raw message data if it's different from last
          if (event.data !== lastProcessedMessageRef.current) {
            lastProcessedMessageRef.current = event.data;
            setLastMessage(event.data);
          }
        } catch (error) {
          console.error('Error handling WebSocket message:', error);
        }
      };

      newSocket.onclose = () => {
        console.log('WebSocket disconnected');
        setStatus('disconnected');
        setSocket(null);

        // Auto reconnect if enabled
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          // Use exponential backoff for reconnection attempts
          const backoffDelay = Math.min(
            reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current),
            30000 // Max 30 second delay
          );
          
          setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connectWebSocket();
          }, backoffDelay);
        }
      };

      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus('error');
        
        // Force close on error to trigger reconnect through onclose
        setTimeout(() => {
          if (newSocket.readyState !== WebSocket.CLOSED) {
            newSocket.close();
          }
        }, 1000);
      };

    } catch (error) {
      console.error('Error creating WebSocket:', error);
      setStatus('error');
      
      // Try to reconnect even if initial connection fails
      if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
        setTimeout(() => {
          reconnectAttemptsRef.current += 1;
          connectWebSocket();
        }, reconnectInterval);
      }
    }
  }, [
    socket,
    autoReconnect,
    reconnectInterval,
    maxReconnectAttempts
  ]);

  // Connect WebSocket on component mount
  useEffect(() => {
    connectWebSocket();

    // Clean up on unmount
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [connectWebSocket]);
  
  // Set up a heartbeat to keep the connection alive
  useEffect(() => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    
    const heartbeatInterval = setInterval(() => {
      try {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
        }
      } catch (error) {
        console.error('Error sending heartbeat:', error);
      }
    }, 30000); // Send heartbeat every 30 seconds
    
    return () => {
      clearInterval(heartbeatInterval);
    };
  }, [socket]);

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    lastProcessedMessageRef.current = '';
    connectWebSocket();
  }, [connectWebSocket]);

  // Function to clear the last message
  const clearLastMessage = useCallback(() => {
    lastProcessedMessageRef.current = '';
    setLastMessage(null);
  }, []);

  return {
    status,
    lastMessage,
    reconnect,
    clearLastMessage,
    isConnecting: status === 'connecting',
    isConnected: status === 'connected'
  };
}