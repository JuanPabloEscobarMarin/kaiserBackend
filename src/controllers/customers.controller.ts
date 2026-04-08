import type { Request, Response } from "express";
import CustomerServices from "../services/customer.services.ts";

class CustomersController {
  getAll = async (_: Request, res: Response) =>
    res.json(await CustomerServices.all());

  getManyByAppointmentId = async (req: Request, res: Response) =>
    res.json(await CustomerServices.byAppointmentId(req.params.id));
}

export default new CustomersController();
