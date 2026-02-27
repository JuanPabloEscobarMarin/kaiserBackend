import AppointmentsController from "../controllers/appointments.ts";
import { Router } from "express";
import {
  cancelAppointment,
  finishAppointment,
} from "../controllers/appointments.ts";

const router = Router();

router.get("/", AppointmentsController.getAll);
router.get("/:id", AppointmentsController.getById);
router.post("/", AppointmentsController.save);
router.put("/:id", AppointmentsController.update);
router.put("/:id/cancel", cancelAppointment);
router.put("/:id/finish", finishAppointment);
router.delete("/:id", AppointmentsController.delete);

export default router;
