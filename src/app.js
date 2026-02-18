import express from "express";
import routes from "./routes/index.js";
import dotenv from "dotenv";
import {SignJWT} from "jose";
import { loadFromDisk } from "./db/database.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Cargar datos desde el disco al iniciar la aplicación
loadFromDisk();

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send(`
        <h1>Welcome to Kaiser Backend</h1>
        <p> This is a simple Express Server </p>
    `);
});

app.get("/health", (req, res) => {
  res.send(`<h1>Todo bien</h1>`);
});


app.get("/logout", (req, res) => {
  res.cookie("jwt_token", null).send("Sesion terminada")
})

export { app };
