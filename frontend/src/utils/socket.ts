import { API_ENDPOINT } from "@/data/apiPaths";
import { io } from "socket.io-client";
 
export const socket = io(API_ENDPOINT);
//export const socket = io('ws://localhost:5000');

socket.on('connect', () => {
  console.log('WebSocket connected');
});