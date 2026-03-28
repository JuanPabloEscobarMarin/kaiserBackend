import type { Request, Response } from "express";
import AppointmentService from "../services/appointments.services.ts";

class AppointmentController {
  getAll = async (_: Request, res: Response) =>
    res.json(await AppointmentService.getAll());

  getById = async (req: Request, res: Response) =>
    res.json(await AppointmentService.getById(req.params.id));

  save = async (req: Request, res: Response) => {
    return res.status(201).json({
      message: "Cita creada exitosamente",
      data: await AppointmentService.create(req.body),
    });
  };

  update = async (req: Request, res: Response) => {
    return res.json({
      message: "Cita actualizada",
      data: await AppointmentService.update(req.params.id, req.body),
    });
  };

  delete = async (req: Request, res: Response) => {
    return res.json({
      message: "Cita eliminada",
      appointment_id: await AppointmentService.delete(req.params.id),
    });
  };

  avalaibleLowerThanNow = async (_: Request, res: Response) => {
    const appointments = await AppointmentService.avalaibleDate();
    return res.json(appointments);
  };

  availableDateByDate = async (req: Request, res: Response) => {
    const date = req.params.date;
    return res.json(await AppointmentService.availableDateByDate(date));
  };
}

export default new AppointmentController();
