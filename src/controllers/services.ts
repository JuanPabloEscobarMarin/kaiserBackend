import AppointmentsController, { AppointmentState } from "./appointments.ts";
import { saveToDisk } from "../db/database.ts";
import type { Request, Response } from "express";

interface Service {
  id: string;
  name: string;
  price: number;
  time: number;
  state: boolean;
  discount: number;
  category: Array<string>;
  createdAt: Date;
}

class ServicesController {
  services: Array<Service> = [];

  getAll = (_: Request, res: Response) => res.json(this.services);

  getById = (req: Request, res: Response) => {
    const service = this.services.find((e) => e.id === req.params.id);

    if (!service) return res.status(404).json({ error: "Service not found" });

    return res.json(service);
  };

  save = (req: Request, res: Response) => {
    const { name, price = 0, time = 0, category = [], state = true, discount = 0 } = req.body;

    try {
      const service: Service = {
        id: crypto.randomUUID(),
        name,
        price,
        time,
        category,
        state,
        discount,
        createdAt: new Date()
      }

      this.services.push(service);
      saveToDisk();

      return res.status(201).json({ message: "Servicio agregado exitosamente", data: service });
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  }

  update = (req: Request, res: Response) => {
    try {
      const serviceId = req.params.id;
      const { name, category, price, time, state, discount } = req.body;
      const service = this.services.find((e) => e.id === serviceId);

      if (!service) throw new Error("Service not found");

      const finalCategories = this.cleanCategories(category);
      const finalName = name || service.name;

      if (finalName.trim().length === 0) throw new Error("name cant be blank");

      const finalPrice = price !== undefined ? Number(price) : service.price;
      const finalTime = time !== undefined ? Number(time) : service.time;
      service.name = finalName;
      service.price = finalPrice;
      service.time = finalTime;
      service.category = finalCategories;
      service.state = state !== undefined ? state : service.state;
      service.discount = discount !== undefined ? discount : service.discount;

      saveToDisk();

      return res.json({ message: "Servicio actualizado exitosamente", data: service });
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  };

  delete = (req: Request, res: Response) => {
    try {
      const serviceId = req.params.id;

      const hasAppointments = AppointmentsController.appointments.some(
        (e) => e.serviceId === serviceId && e.state === AppointmentState.SCHEDULED,
      );

      if (hasAppointments) throw new Error("Cant delete this service, there are appointments with this service");

      const index = this.services.findIndex((e) => e.id === serviceId);

      if (index !== -1) {
        const deleted = this.services.splice(index, 1)[0];
        saveToDisk();

        return res.json({ message: "Servicio eliminado exitosamente", service: { id: deleted?.id, name: deleted?.name } });
      } else {
        throw new Error("Service not found");
      }
    } catch (error) {
      if (error instanceof Error) return res.status(400).json({ error: error.message });
    }
  };

  private cleanCategories = (categories: Array<string> | string) => {
    const categoryArray = Array.isArray(categories) ? categories : [categories];

    const cleanCategories = categoryArray
      .map((e) => (typeof e === "string" ? e.trim() : e))
      .filter((e) => e !== "");

    return [...new Set(["General", ...cleanCategories])];
  };
};

export default new ServicesController();