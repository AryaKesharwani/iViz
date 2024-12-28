const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const cors = require('cors');


const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { doubtRoutes, quizRoutes } = require('./routes');

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/api/doubts', doubtRoutes);
app.use('/api/questions', quizRoutes);

// WebSocket setup
wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.error('Invalid JSON format:', error);
      return;
    }

    if (parsedMessage.type === 'trigger') {
      // Broadcast to all connected WebSocket clients
      const eventData = {
        type: 'showDialog',
      };

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(eventData));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}`);
});




