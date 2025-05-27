import express from 'express';
import {PORT} from './config/env.js';
import authRouter from './routes/auth.routes.js';
import connectToDatabase from './database/mongodb.js';
import sessionRouter from './routes/session.routes.js';
import documentRouter from './routes/document.routes.js';
import searchDocumentRouter from './routes/documentSearch.routes.js';

const app = express();

//middleware
app.use(express.json());

//Routes
app.use('/api/v0/auth', authRouter);
app.use('/api/v0/sessions', sessionRouter);
app.use('/api/v0/documents', documentRouter)
app.use('/api/v0/summary', searchDocumentRouter)

app.get("/", (req, res) => {
    console.log('Hello world');
    res.send('Peace');
});

app.listen(PORT, async() => {
    console.log(`Server is running ${PORT}` )

    await connectToDatabase();
});