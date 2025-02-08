import app from './app.js';
import dotenv from 'dotenv';
import connectMongodb from './db/index.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
    },
});

const init = async () => {
    try {
        await connectMongodb();
        console.log('Database connected successfully.');

        // Set up Socket.io
        io.on('connection', (socket) => {
            console.log('New client connected:', socket.id);

            // Handle incoming messages
            socket.on('user-message', (message) => {
                console.log('Received message:', message);
                io.emit('message', `User says: ${message}`);
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        const port = process.env.PORT || 5000;
        server.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Critical failure during startup:', error);
        process.exit(1); // Exit process for critical failures
    }
};

init();
