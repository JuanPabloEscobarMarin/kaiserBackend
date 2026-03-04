import type { Request, Response } from "express";
import AppointmentService from "../services/appointments.services.ts";

class AppointmentController {
    getAll = async (_: Request, res: Response) =>
        res.json(await AppointmentService.getAll());

    getById = async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.getById(req.params.id);
            return appointment
                ? res.json(appointment)
                : res.status(404).json({ error: "Appointment not found" });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ error: error.message });
            }
        }
    };

    save = async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.create(req.body);
            return res.status(201).json({
                message: "Cita creada exitosamente",
                data: appointment,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.update(
                req.params.id,
                req.body,
            );
            return res.json({
                message: "Cita actualizada",
                data: appointment,
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: error.message });
            }
        }
    };

    delete = async (req: Request, res: Response) => {
        try {
            const appointment = await AppointmentService.delete(req.params.id);
            return res.json({
                message: "Cita eliminada",
                data: {
                    id: appointment.id
                },
            });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message });
            }
        }
    };

    avalaibleLowerThanNow = async (_: Request, res: Response) => {
        const appointments = await AppointmentService.avalaibleDate();
        return res.json(appointments)
    }

    availableDateByDate = async (req: Request, res: Response) => {
        const date = req.params.date;

        return res.json(await AppointmentService.availableDateByDate(date))
    }
}

export default new AppointmentController();
