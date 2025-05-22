import express from 'express';
import {PORT} from './config/env.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';

const app = express();

//middleware
app.use(express.json());

//Routes
app.use('/api/v0/auth', authRouter);

app.get("/", (req, res) => {
    console.log('Hello world');
    res.send('Peace');
});

app.listen(PORT, async() => {
    console.log(`Server is running ${PORT}` )

    await connectToDatabase();
});