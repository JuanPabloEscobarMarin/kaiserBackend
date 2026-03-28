import type { Request, Response } from "express";
import ServiceService from "../services/service.services.ts";

class ServicesController {
  getAll = async (_: Request, res: Response) =>
    res.json(await ServiceService.getAll());

  getById = async (req: Request, res: Response) =>
    res.json(await ServiceService.getById(req.params.id));

  save = async (req: Request, res: Response) => {
    return res.status(201).json({
      message: "Servicio creado exitosamente",
      data: await ServiceService.create(req.body),
    });
  };

  update = async (req: Request, res: Response) => {
    return res.json({
      message: "Servicio actualizado",
      data: await ServiceService.update(req.params.id, req.body),
    });
  };

  delete = async (req: Request, res: Response) => {
    return res.json({
      message: "Servicio eliminado",
      service_id: (await ServiceService.delete(req.params.id)).id,
    });
  };

  deleteMany = async (req: Request, res: Response) => {
    return res.json({
      message: "Servicios eliminados",
      deleteCount: (await ServiceService.deleteMany(req.body.ids)).count,
    });
  };
}

export default new ServicesController();
