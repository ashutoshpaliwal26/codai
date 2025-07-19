import dotenv from 'dotenv'
import path from 'path'
import { connectToDb } from "@repo/db/connect";
import express from 'express'
import { authRouter } from './routes/auth';
import cors from 'cors'

dotenv.config({
    path : path.resolve(__dirname, "../../../.env")
});

async function db() {
    await connectToDb("mongodb://admin:root@127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.3");
}

db();

const app = express();
const PORT = process.env.AUTH_PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Auth Service is Running on PORT : ${PORT}`));



