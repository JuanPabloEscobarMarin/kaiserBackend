import type { Request, Response } from "express";
import ServiceService from "../services/service.services.ts";

class ServicesController {
    getAll = async (_: Request, res: Response) =>
        res.json(await ServiceService.getAll());

    getById = async (req: Request, res: Response) => {
        try {
            const service = await ServiceService.getById(req.params.id);
            return service
                ? res.json(service)
                : res.status(404).json({ error: "Service not found" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
        }
    };

    save = async (req: Request, res: Response) => {
        try {
            const service = await ServiceService.create(req.body);
            return res.status(201).json({
                message: "Servicio creado exitosamente",
                data: service,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const service = await ServiceService.update(
                req.params.id,
                req.body,
            );
            return res.json({ message: "Servicio actualizado", data: service });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const service = await ServiceService.delete(req.params.id);
            return res.json({
                message: "Servicio eliminado",
                service: { id: service.id, name: service.name },
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
        }
    };
}

export default new ServicesController();
