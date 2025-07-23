import dotenv from 'dotenv'
import path from 'path'
import { connectToDb } from "@repo/db/connect";
import express from 'express'
import { authRouter } from './routes/auth';
import cors from 'cors'

dotenv.config({
    path : path.resolve(__dirname, "../../../.env"),
    override : true
});

async function db() {
    await connectToDb(process.env.MONGO_DB_URI as string);
}

db();

const app = express();
const PORT = process.env.AUTH_PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Auth Service is Running on PORT : ${PORT}`));



