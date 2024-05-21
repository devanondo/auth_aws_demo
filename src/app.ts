import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import { ExampleRoutes } from './app/modules/example/example.route';
import globalErrorHandler from './middleware/global-error-handler';

dotenv.config();
const app: Application = express();

//Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Application routes
app.use('/api/v1', ExampleRoutes);

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: '🛢️ Server is Running...',
    });
});

// global Error handler
app.use(globalErrorHandler);

export default app;
