import AppointmentController from "../controllers/appointments.ts";
import { Router } from "express";

const router = Router();

router.get("/", AppointmentController.getAll);
router.get("/:id", AppointmentController.getById);
router.post("/", AppointmentController.save);
router.put("/:id", AppointmentController.update);
router.delete("/:id", AppointmentController.delete);

export default router;
