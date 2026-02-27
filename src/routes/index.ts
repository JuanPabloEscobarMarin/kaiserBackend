import { Router } from "express";
import servicesRouter from "./services.ts";
import employeesRouter from "./employees.ts";
import appointmentsRouter from "./appointments.ts";
import usersRouter from "./users.ts";
import authRouter from "./auth.ts";
import { adminVerify } from "../middlewares/auth.middleware.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/services", adminVerify, servicesRouter);
router.use("/employees", adminVerify, employeesRouter);
router.use("/appointments", adminVerify, appointmentsRouter);

export default router;
