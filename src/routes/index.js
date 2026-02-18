import { Router } from "express";
import servicesRouter from "./services.js";
import employeesRouter from "./employees.js";
import appointmentsRouter from "./appointments.js";
import { adminVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/services", adminVerify, servicesRouter);
router.use("/employees", adminVerify, employeesRouter);
router.use("/appointments", adminVerify, appointmentsRouter);

export default router;
