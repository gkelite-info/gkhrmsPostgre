import express from "express";
import dbInit from "./db/init";
import dotenv from 'dotenv'
import routes from "./db/routes";
import cors from 'cors'
dotenv.config();

const app = express();

const port = process.env.PORT || 5000;

dbInit();

app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

app.get('/', (req, res) => {
    res.send('Welcome to GKHRMS');
});

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
});