import AppointmentsController from "../controllers/appointments.ts";
import { Router } from "express";

const router = Router();

router.get("/", AppointmentsController.getAll);
router.get("/:id", AppointmentsController.getById);
router.post("/", AppointmentsController.save);
router.put("/:id", AppointmentsController.update);
router.put("/:id/cancel", AppointmentsController.cancel);
router.put("/:id/finish", AppointmentsController.finish);
router.delete("/:id", AppointmentsController.delete);

export default router;
