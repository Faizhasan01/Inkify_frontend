import { useState, useEffect, useCallback, useRef } from "react";
import { getWsUrl } from "../lib/api.js";

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000;

export function useWebSocket(options) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const wsRef = useRef(null);
  const storedUsername = useRef(null);
  const storedRoomId = useRef(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef(null);
  const intentionalDisconnect = useRef(false);
  const optionsRef = useRef(options);
  
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const clearReconnectTimer = () => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }
  };

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || 
        wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    const wsUrl = getWsUrl();
    
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        reconnectAttempts.current = 0;
        
        if (storedUsername.current) {
          ws.send(JSON.stringify({
            type: "join",
            username: storedUsername.current,
            roomId: storedRoomId.current,
          }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === "welcome") {
            setCurrentUser({
              id: message.userId,
              username: message.username,
              color: message.color,
            });
            if (message.roomId) {
              setCurrentRoomId(message.roomId);
              storedRoomId.current = message.roomId;
              optionsRef.current?.onRoomJoined?.(message.roomId);
            }
          }

          if (message.type === "users") {
            setUsers(message.users);
          }

          if (message.type === "board:state") {
            optionsRef.current?.onBoardState?.(message.elements);
          }

          if (message.type === "element:create") {
            optionsRef.current?.onElementCreate?.(message.element);
          }

          if (message.type === "board:clear") {
            optionsRef.current?.onBoardClear?.();
          }

          if (message.type === "page:state") {
            optionsRef.current?.onPageState?.(message.currentPage, message.totalPages, message.elements);
          }

          if (message.type === "page:allPages") {
            optionsRef.current?.onAllPages?.(message.pages);
          }
        } catch (err) {
          console.error("WebSocket message error:", err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        wsRef.current = null;

        if (!intentionalDisconnect.current && storedUsername.current) {
          if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts.current++;
            console.log(`WebSocket disconnected. Reconnecting attempt ${reconnectAttempts.current}...`);
            
            reconnectTimer.current = setTimeout(() => {
              connect();
            }, RECONNECT_DELAY);
          } else {
            console.log("Max reconnect attempts reached. Please rejoin.");
            setCurrentUser(null);
            setUsers([]);
            storedUsername.current = null;
            reconnectAttempts.current = 0;
            optionsRef.current?.onDisconnected?.();
          }
        } else {
          setCurrentUser(null);
          setUsers([]);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
    }
  }, []);

  const join = useCallback((username, roomId) => {
    intentionalDisconnect.current = false;
    storedUsername.current = username;
    storedRoomId.current = roomId || null;
    reconnectAttempts.current = 0;
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "join",
        username,
        roomId,
      }));
    } else {
      connect();
    }
  }, [connect]);

  const disconnect = useCallback(() => {
    intentionalDisconnect.current = true;
    storedUsername.current = null;
    storedRoomId.current = null;
    reconnectAttempts.current = 0;
    clearReconnectTimer();
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setCurrentUser(null);
    setUsers([]);
    setCurrentRoomId(null);
  }, []);

  const sendElement = useCallback((element) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "element:create",
        element,
      }));
    }
  }, []);

  const sendClear = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "board:clear",
      }));
    }
  }, []);

  const sendUndo = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "board:undo",
      }));
    }
  }, []);

  const sendAddPage = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "page:add",
      }));
    }
  }, []);

  const sendNavigatePage = useCallback((pageIndex) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "page:navigate",
        pageIndex,
      }));
    }
  }, []);

  const sendDeletePage = useCallback((pageIndex) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "page:delete",
        pageIndex,
      }));
    }
  }, []);

  const sendLoadPages = useCallback((pages) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "page:load",
        pages,
      }));
    }
  }, []);

  const sendResetPages = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "page:reset",
      }));
    }
  }, []);

  const requestAllPages = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: "page:getAll",
      }));
    }
  }, []);

  useEffect(() => {
    return () => {
      clearReconnectTimer();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {
    users,
    currentUser,
    isConnected,
    currentRoomId,
    join,
    disconnect,
    sendElement,
    sendClear,
    sendUndo,
    sendAddPage,
    sendNavigatePage,
    sendDeletePage,
    sendLoadPages,
    sendResetPages,
    requestAllPages,
  };
}
