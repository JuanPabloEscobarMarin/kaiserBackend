import { appointments } from "./appointments.js";
import { saveToDisk } from "../db/database.js";

export class Service {
  constructor({
    id,
    createdAt,
    name,
    price = 0,
    time = 0,
    category = [],
    state = true,
    discount,
  } = {}) {
    if (!name || name.trim().length === 0) {
      throw new Error("name cant be blank");
    }
    const categoryArray = Array.isArray(category) ? category : [category];
    const cleanCategories = categoryArray
      .map((e) => (typeof e === "string" ? e.trim() : e))
      .filter((e) => e !== "");
    this.category = [...new Set(["General", ...cleanCategories])];
    this.id = id || crypto.randomUUID();
    this.name = name;
    this.price = Number(price);
    this.time = Number(time);
    this.state = state;
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.discount = discount;
  }
}

export const services = [];

// Express controller functions
export const getAllServices = (req, res) => {
  res.json(services);
};

export const addService = (req, res) => {
  try {
    const newService = new Service(req.body);
    services.push(newService);
    saveToDisk();
    res
      .status(201)
      .json({ message: "Servicio agregado exitosamente", data: newService });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getServiceById = (req, res) => {
  const service = services.find((e) => e.id === req.params.id);
  if (!service) {
    return res.status(404).json({ error: "Service not found" });
  }
  res.json(service);
};

export const updateService = (req, res) => {
  try {
    const serviceId = req.params.id;
    const update = req.body;
    const service = services.find((e) => e.id === serviceId);
    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }
    const finalCategories = cleanCategories(update.category);
    const finalName = update.name || service.name;
    if (finalName.trim().length === 0) {
      throw new Error("name cant be blank");
    }
    const finalPrice =
      update.price !== undefined ? Number(update.price) : service.price;
    const finalTime =
      update.time !== undefined ? Number(update.time) : service.time;
    service.name = finalName;
    service.price = finalPrice;
    service.time = finalTime;
    service.category = finalCategories;
    service.state = update.state !== undefined ? update.state : service.state;
    service.discount =
      update.discount !== undefined ? update.discount : service.discount;
    saveToDisk();
    res.json({ message: "Servicio actualizado exitosamente", data: service });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteService = (req, res) => {
  try {
    const serviceId = req.params.id;
    const hasAppointments = appointments.some(
      (e) => e.serviceId === serviceId && e.state === "scheduled",
    );
    if (hasAppointments) {
      return res.status(400).json({
        error:
          "Cant delete this service, there are appointments with this service",
      });
    }
    const index = services.findIndex((e) => e.id === serviceId);
    if (index !== -1) {
      const deleted = services.splice(index, 1)[0];
      saveToDisk();
      res.json({
        message: "Servicio eliminado exitosamente",
        deletedId: deleted.id,
        name: deleted.name,
      });
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helpers internos (no exportar)
const cleanCategories = (category) => {
  const categoryArray = Array.isArray(category) ? category : [category];
  const cleanCategories = categoryArray
    .map((e) => (typeof e === "string" ? e.trim() : e))
    .filter((e) => e !== "");
  return [...new Set(["General", ...cleanCategories])];
};
