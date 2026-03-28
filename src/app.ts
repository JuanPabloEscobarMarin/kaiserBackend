import express from "express";
import routes from "./routes/index.ts";
import cookieParser from "cookie-parser";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware.ts";
import { asyncHandler } from "./middlewares/async-handler.ts";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

app.use("/api", asyncHandler(routes));
app.use(errorMiddleware);

export { app };
