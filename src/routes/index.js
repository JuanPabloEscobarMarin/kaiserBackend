import { Router } from "express";
import servicesRouter from "./services.js";
import employeesRouter from "./employees.js";
import appointmentsRouter from "./appointments.js";

const router = Router();

router.use("/services", servicesRouter);
router.use("/employees", employeesRouter);
router.use("/appointments", appointmentsRouter);

export default router;
