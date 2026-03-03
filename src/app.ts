import express from "express";
import routes from "./routes/index.ts";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";

dotenv.config();
//esta vaina la agregue porque no me funcionaba en mi pc
// Allow self-signed TLS certificates in development only.
// This bypasses Node's certificate validation and MUST NOT be used in production.
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const app = express();

app.use(express.json());
app.use(cookieParser());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

app.use("/api", routes);

export { app };
