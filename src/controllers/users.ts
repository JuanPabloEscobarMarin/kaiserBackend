import crypto from "crypto";
import { saveToDisk } from "../db/database.ts";
import type { Request, Response } from "express";

interface User {
  id: string;
  username: string;
  password: string;
  phone: string;
  role: 'admin' | 'client';
}

class UsersController {
  users: Array<User> = [];

  getAll = (_: Request, res: Response) => res.json(this.users);

  getById = (req: Request, res: Response) => {
    const user = this.users.find((u) => u.id === req.params.id);
    return user ? res.json(user) : res.status(404).json({ error: "User not found" })
  }

  save = (req: Request, res: Response) => {
    try {
      const { username, password, phone, role } = req.body;

       if (
      !username ||
      typeof username !== "string" ||
      username.trim().length === 0
    ) {
      throw new Error("username is required");
    }
    if (
      !password ||
      typeof password !== "string" ||
      password.trim().length === 0
    ) {
      throw new Error("password is required");
    }
    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      throw new Error("number is required");
    }

    const user: User = {
      id: crypto.randomUUID(),
      username,
      password,
      phone,
      role,
    }

    this.users.push(user)
    saveToDisk();

    return res.status(201).json({ message: "Usuario creado exitosamente", data: user });
      
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  }

  update = (req: Request, res: Response) => {
    const user = this.users.find((u) => u.id === req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    Object.assign(user, req.body);
    saveToDisk();

    return res.json({ message: "Usuario actualizado", data: user });
  }

  delete = (req: Request, res: Response) => {
    const index = this.users.findIndex((u) => u.id === req.params.id);

    if (!index) return res.status(404).json({ error: "User not found" });

    const deleted = this.users.splice(index, 1)[0];
    saveToDisk();

    return res.json({ message: "Usuario eliminado", user: {id: deleted?.id, username: deleted?.username} });
  }
}

export default new UsersController();
