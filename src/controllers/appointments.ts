import ServicesController from "./services.ts";
import { saveToDisk } from "../db/database.ts";
import type { Request, Response } from "express";

interface Appointment {
  id: string;
  serviceId: string;
  employeeId: string;
  startTime: Date;
  customerName: string;
  customerNumber: number;
  state: AppointmentState;
  createdAt: Date;
  updatedAt: Date;
  observation: string;
}

export enum AppointmentState {
  "SCHEDULED",
  "CANCELLED",
  "FINISHED",
}

class AppointmentsController {
  appointments: Array<Appointment> = [];

  getAll = (_: Request, res: Response) => res.json(this.appointments);

  getById = (req: Request, res: Response) => {
    const appointment = this.appointments.find((e) => e.id === req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    return res.json(appointment);
  };

  save = (req: Request, res: Response) => {
    try {
      // Llenalo tu
      const appointment: Appointment = {
        id: crypto.randomUUID(),
        serviceId: req.body.serviceId,
        employeeId: req.body.employeeId,
        startTime: new Date(req.body.startTime),
        customerName: req.body.customerName,
        customerNumber: Number(req.body.customerNumber),
        state: AppointmentState.SCHEDULED,
        createdAt: new Date(),
        updatedAt: new Date(),
        observation: req.body.observation || "",
      };

      if (!this.isAvailable(appointment)) {
        throw new Error("Cant create the appointment, is not a slot available");
      }

      this.appointments.push(appointment);
      saveToDisk();

      return res.status(201).json({
        message: "Cita agendada exitosamente",
        data: appointment,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };

  update = (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const update = req.body;
      const appointment = this.appointments.find((e) => e.id === id);

      if (!appointment) throw new Error("Appointment Not Found");
      if (appointment.state !== AppointmentState.SCHEDULED) {
        throw new Error("Only scheduled appointments can be edited");
      }

      const finalStartTime = update.startTime || appointment.startTime;
      const finalServiceId = update.serviceId || appointment.serviceId;
      const finalEmployeeId = update.employeeId || appointment.employeeId;
      const finalCustomerName = update.customerName || appointment.customerName;
      const finalCustomerNumber = update.customerNumber !== undefined
        ? Number(update.customerNumber)
        : appointment.customerNumber;
      const finalObservation = update.observation || appointment.observation;

      const appointmentInstance: Appointment = {
        id: appointment.id,
        serviceId: finalServiceId,
        employeeId: finalEmployeeId,
        startTime: new Date(finalStartTime),
        customerName: finalCustomerName,
        customerNumber: finalCustomerNumber,
        state: appointment.state,
        createdAt: appointment.createdAt,
        updatedAt: new Date(),
        observation: finalObservation,
      };

      const checkAvailable = this.isAvailable(appointmentInstance);

      if (!checkAvailable) throw new Error("Cant re-scheduled the appointment");

      appointment.startTime = finalStartTime;
      appointment.serviceId = finalServiceId;
      appointment.employeeId = finalEmployeeId;
      appointment.observation = finalObservation;
      appointment.customerName = finalCustomerName;
      appointment.customerNumber = finalCustomerNumber;
      appointment.updatedAt = new Date();
      saveToDisk();

      return res.json({
        message: "Cita actualizada exitosamente",
        data: appointment,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };

  delete = (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const index = this.appointments.findIndex((e) => e.id === id);
      if (index !== -1) {
        const deleted = this.appointments.splice(index, 1)[0];
        saveToDisk();

        return res.json({
          message: "Cita eliminada exitosamente",
          deletedId: deleted?.id,
        });
      } else {
        throw new Error("Appointment not found");
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };

  cancel = (req: Request, res: Response) => {
    try {
      const appointmentId = req.params.id;
      const appointment = this.appointments.find((e) => e.id === appointmentId);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      appointment.state = AppointmentState.CANCELLED;
      saveToDisk();
      console.log(`Appointment has been cancelled.`);
      res.json({
        message: "Cita cancelada exitosamente",
        data: appointment,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };

  finish = (req: Request, res: Response) => {
    try {
      const appointmentId = req.params.id;
      const appointment = this.appointments.find((e) => e.id === appointmentId);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      if (appointment.state !== AppointmentState.SCHEDULED) {
        throw new Error(
          "This Appointment is not scheduled, it finished or cancelled",
        );
      }
      appointment.state = AppointmentState.FINISHED;
      saveToDisk();
      console.log("Appointment has been finished");
      res.json({
        message: "Cita finalizada exitosamente",
        data: appointment,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
    }
  };

  private isAvailable = (
    appointment: Appointment,
    newStart = appointment.startTime,
    ignoreId = null,
  ) => {
    const employeeAppointments = this.appointments.filter(
      (e) =>
        e.employeeId === appointment.employeeId &&
        e.state !== AppointmentState.CANCELLED &&
        e.id !== ignoreId,
    ); // refactorizar para programacion funcional y no mutar el array original
    const serviceObj = ServicesController.services.find((e) =>
      e.id === appointment.serviceId
    );
    if (!serviceObj) {
      throw new Error("Service doesnt exist");
    }
    const serviceTime = serviceObj.time;
    const newStartTime = new Date(newStart).getTime();
    const newEndTime = new Date(newStartTime + serviceTime * 60000).getTime();

    for (let appointment of employeeAppointments) {
      const existingService = ServicesController.services.find(
        (e) => e.id === appointment.serviceId,
      );
      const existingDurationService = existingService?.time || 0;
      const existingStart = new Date(appointment.startTime).getTime();
      const existingEnd = getEndTime(
        appointment.startTime,
        existingDurationService,
      ).getTime();

      if (newStartTime < existingEnd && newEndTime > existingStart) {
        return false;
      }
    }
    return true;
  };

  private getEndTime = (startTime: Date, duration: number): Date => {
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + duration);
    return endTime;
  };

 getAvailableSlots = (employeeId: string, serviceId: string, date:) => {
  const slots = [];
  const service = ServicesController.services.find((e) => e.id === serviceId);
  let currentHour = new Date(date.replace(/-/g, "/"));
  currentHour.setHours(8, 0, 0, 0); // parametrizar para que sean variables que pueda cambiar el admin facilmente desde un panel de control
  const endOfDay = new Date(currentHour);
  endOfDay.setHours(17, 0, 0, 0); // parametrizar para que sean variables que pueda cambiar el admin facilmente desde un panel de control
  while (currentHour < endOfDay) {
    const potentialEndTime = new Date(currentHour);
    potentialEndTime.setMinutes(potentialEndTime.getMinutes() + (service?.time || 0));
    if (
      this.isAvailable(appoi, currentHour, serviceId) &&
      potentialEndTime <= endOfDay
    ) {
      slots.push(currentHour.toLocaleString());
    }
    currentHour.setMinutes(currentHour.getMinutes() + 30);
  }
  return slots;
};
}

export default new AppointmentsController();


