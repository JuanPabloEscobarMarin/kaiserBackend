import { services } from "./services.js";
import { saveToDisk } from "../db/database.js";

export class Appointment {
  constructor({
    id,
    serviceId,
    employeeId,
    startTime,
    customerName,
    customerIdentification,
    state,
    createdAt,
    updatedAt,
    observation,
  } = {}) {
    if (
      !serviceId ||
      !employeeId ||
      !customerName ||
      !startTime ||
      !customerIdentification
    ) {
      throw new Error("Missing information to schedule an appointment");
    }
    this.id = id || crypto.randomUUID();
    this.serviceId = serviceId;
    this.employeeId = employeeId;
    this.startTime = startTime;
    this.customerName = customerName;
    this.customerIdentification = customerIdentification;
    this.state = state ? state : "scheduled";
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
    this.observation = observation;
  }
}

export const appointments = [];

// Express controller functions
export const getAllAppointments = (req, res) => {
  res.json(appointments);
};

export const addAppointment = (req, res) => {
  try {
    const newAppointment = new Appointment(req.body);
    if (
      !isAvailable(
        newAppointment.employeeId,
        newAppointment.startTime,
        newAppointment.serviceId,
      )
    ) {
      throw new Error("Cant create the appointment, is not a slot available");
    }
    appointments.push(newAppointment);
    saveToDisk();
    res
      .status(201)
      .json({ message: "Cita agendada exitosamente", data: newAppointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAppointmentById = (req, res) => {
  const appointment = appointments.find((e) => e.id === req.params.id);
  if (!appointment) {
    return res.status(404).json({ error: "Appointment not found" });
  }
  res.json(appointment);
};

export const updateAppointment = (req, res) => {
  try {
    const id = req.params.id;
    const update = req.body;
    const appointment = appointments.find((e) => e.id === id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment Not Found" });
    }
    if (appointment.state !== "scheduled") {
      throw new Error("Only scheduled appointments can be edited");
    }
    const finalStartTime = update.startTime || appointment.startTime;
    const finalServiceId = update.serviceId || appointment.serviceId;
    const finalEmployeeId = update.employeeId || appointment.employeeId;
    const finalCustomerName = update.customerName || appointment.customerName;
    const finalCustomerIdentification =
      update.customerIdentification || appointment.customerIdentification;
    const finalObservation = update.observation || appointment.observation;
    const checkAvailable = isAvailable(
      finalEmployeeId,
      finalStartTime,
      finalServiceId,
      id,
    );
    if (!checkAvailable) {
      throw new Error("Cant re-scheduled the appointment");
    }
    appointment.startTime = finalStartTime;
    appointment.serviceId = finalServiceId;
    appointment.employeeId = finalEmployeeId;
    appointment.observation = finalObservation;
    appointment.customerName = finalCustomerName;
    appointment.customerIdentification = finalCustomerIdentification;
    appointment.updatedAt = new Date();
    saveToDisk();
    res.json({ message: "Cita actualizada exitosamente", data: appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteAppointment = (req, res) => {
  try {
    const id = req.params.id;
    const index = appointments.findIndex((e) => e.id === id);
    if (index !== -1) {
      const deleted = appointments.splice(index, 1)[0];
      saveToDisk();
      res.json({
        message: "Cita eliminada exitosamente",
        deletedId: deleted.id,
      });
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const cancelAppointment = (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = appointments.find((e) => e.id === appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    appointment.state = "cancelled";
    saveToDisk();
    console.log(`Appointment has been cancelled.`);
    res.json({
      message: "Cita cancelada exitosamente",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const finishAppointment = (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = appointments.find((e) => e.id === appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (appointment.state !== "scheduled") {
      return res
        .status(400)
        .json({
          error: "This Appointment is not scheduled, it finished or cancelled",
        });
    }
    appointment.state = "finished";
    saveToDisk();
    console.log("Appointment has been finished");
    res.json({
      message: "Cita finalizada exitosamente",
      data: appointment,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helpers internos (no exportar)
export const getEndTime = (startTime, duration) => {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + duration);
  return endTime;
};

export const isAvailable = (
  employeeId,
  newStart,
  serviceId,
  ignoreId = null,
) => {
  const employeeAppointments = appointments.filter(
    (e) =>
      e.employeeId === employeeId &&
      e.state !== "cancelled" &&
      e.id !== ignoreId,
  );
  const serviceObj = services.find((e) => e.id === serviceId);
  if (!serviceObj) {
    throw new Error("Service doesnt exist");
  }
  const serviceTime = serviceObj.time;
  const newStartTime = new Date(newStart).getTime();
  const newEndTime = new Date(newStartTime + serviceTime * 60000);

  for (let appointment of employeeAppointments) {
    const existingService = services.find(
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

export const getAvailableSlots = (employeeId, serviceId, date) => {
  const slots = [];
  const service = services.find((e) => e.id === serviceId);
  let currentHour = new Date(date.replace(/-/g, "/"));
  currentHour.setHours(8, 0, 0, 0);
  const endOfDay = new Date(currentHour);
  endOfDay.setHours(17, 0, 0, 0);
  while (currentHour < endOfDay) {
    const potentialEndTime = new Date(currentHour);
    potentialEndTime.setMinutes(potentialEndTime.getMinutes() + service.time);
    if (
      isAvailable(employeeId, currentHour, serviceId) &&
      potentialEndTime <= endOfDay
    ) {
      slots.push(currentHour.toLocaleString());
    }
    currentHour.setMinutes(currentHour.getMinutes() + 30);
  }
  return slots;
};
