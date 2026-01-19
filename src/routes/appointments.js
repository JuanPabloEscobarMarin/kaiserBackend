import { Router } from "express";
import {
  getAllAppointments,
  addAppointment,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  cancelAppointment,
  finishAppointment,
} from "../controllers/appointments.js";

const router = Router();

router.get("/", getAllAppointments);
router.post("/", addAppointment);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.put("/:id/cancel", cancelAppointment);
router.put("/:id/finish", finishAppointment);

export default router;
