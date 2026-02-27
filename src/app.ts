import express from "express";
import routes from "./routes/index.ts";
import dotenv from "dotenv";
import { loadFromDisk } from "./db/database.ts";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Cargar datos desde el disco al iniciar la aplicación
loadFromDisk();

app.use("/api", routes);

export { app };
