import { Server } from 'socket.io';
import http from 'http';

let io;

export const initializeSocket = (app) => {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3005",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    // console.log('New client connected:', socket.id);
    
    // Join a delivery tracking room
    socket.on('joinDeliveryRoom', (deliveryId) => {
      socket.join(`delivery_${deliveryId}`);
      console.log(`Client joined delivery room: delivery_${deliveryId}`);
    });
    
    // Leave a delivery tracking room
    socket.on('leaveDeliveryRoom', (deliveryId) => {
      socket.leave(`delivery_${deliveryId}`);
      console.log(`Client left delivery room: delivery_${deliveryId}`);
    });
    
    // Disconnect event
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return server;
};

// Function to emit location updates to all clients in a specific delivery room
export const emitLocationUpdate = (deliveryId, locationData) => {
  if (io) {
    io.to(`delivery_${deliveryId}`).emit('locationUpdate', locationData);
  }
};

// Add this function to your existing socket.js file
export const emitStatusUpdate = (deliveryId, statusData) => {
  if (io) {
    io.to(`delivery_${deliveryId}`).emit('statusUpdate', statusData);
  }
};
