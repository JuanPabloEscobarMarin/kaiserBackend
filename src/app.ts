import express from "express";
import routes from "./routes/index.ts";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

app.use("/api", routes);

export { app };
