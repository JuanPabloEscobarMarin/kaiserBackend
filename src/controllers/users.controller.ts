import type { Request, Response } from "express";
import UserService from "../services/user.services.ts";

class UsersController {
  getAll = async (_: Request, res: Response) =>
    res.json(await UserService.getAll());

  getById = async (req: Request, res: Response) => {
    res.json(await UserService.getById(req.params));
  };

  save = async (req: Request, res: Response) => {
    return res.status(201).json({
      message: "Usuario creado exitosamente",
      data: await UserService.create(req.body),
    });
  };

  update = async (req: Request, res: Response) => {
    return res.json({
      message: "Usuario actualizado",
      data: await UserService.update(req.params.id, req.body),
    });
  };

  delete = async (req: Request, res: Response) => {
    return res.json({
      message: "Usuario eliminado",
      user_id: (await UserService.delete(req.params)).id,
    });
  };
}

export default new UsersController();
