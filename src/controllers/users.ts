import type { Request, Response } from "express";
import UserService from "../services/user.services.ts";

class UsersController {
  getAll = async (_: Request, res: Response) => res.json(await UserService.getAll());

  getById = async (req: Request, res: Response) => {
    try {
      const user = await UserService.getById(req.params);
      return user ? res.json(user) : res.status(404).json({ error: "User not found" })
    } catch (error) {
      if (error instanceof Error) return res.json({ error: error.message })
    }
  }

  save = async (req: Request, res: Response) => {
    try {
      const user = await UserService.create(req.body);
      return res.status(201).json({ message: "Usuario creado exitosamente", data: user });
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  }

  update = async (req: Request, res: Response) => {
    try {
      const user = await UserService.update(req.params.id, req.body);
      return res.json({ message: "Usuario actualizado", data: user });
    } catch (error) {
      if (error instanceof Error) return res.status(401).json({ error: error.message })
    }
  }

  delete = async (req: Request, res: Response) => {
    try {
      const user = await UserService.delete(req.params);
      return res.json({ message: "Usuario eliminado", user: { id: user.id, username: user.username } });
    } catch (error) {
      if (error instanceof Error) return res.json({ error: error.message })
    }
  }
}

export default new UsersController();
