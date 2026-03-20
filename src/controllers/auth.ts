import type { Request, Response } from "express";
import UsersController from "./users.ts";
import userRepository from "../repositories/user.repository.ts";
import { SignJWT } from "jose";

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await userRepository.byUsername(username);
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const valid = password === user.password;
    if (!valid) {
        return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const jwt = await new SignJWT({ id: user.id, role: user.role })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(secret);

    res.cookie("jwt_token", jwt).json({ message: "Login exitoso" });
};

export const logout = (_: Request, res: Response) => {
    res.clearCookie("jwt_token").json({ message: "Sesion terminada" });
};
