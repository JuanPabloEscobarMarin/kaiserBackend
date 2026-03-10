import express from "express";
import routes from "./routes/index.ts";
import cookieParser from "cookie-parser";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

app.use("/api", routes);

export { app };
