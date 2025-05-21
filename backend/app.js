import express from 'express';
import {config} from 'dotenv';

const app = express();

app.get("/", (req, res) => {
    console.log('Hello world');
    res.send('Peace');
});

app.listen(5500);