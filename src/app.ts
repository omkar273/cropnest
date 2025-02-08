import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import { Request, Response } from 'express';
import { verifyJwt } from './middlewares/index.js';
import swaggerUi from 'swagger-ui-express';

import { authRouter, fileRouter, policyRouter, userRouter } from './routes/index.js';
import { swaggerDocs } from './swagger.js';

const app = express();

app.use(express.json());

app.use(compression());

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use(cookieParser());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);

app.get('/', (req: Request, res: Response) => {
    res.sendFile('/public/index.html');
});

app.get('/ping', (req: Request, res: Response) => {
    res.send('pong 🏓');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

// auth routes
app.use('/auth', authRouter);

app.use('/user', userRouter);

app.use('/files', fileRouter);

app.use('/policy', verifyJwt, policyRouter);

export default app;
