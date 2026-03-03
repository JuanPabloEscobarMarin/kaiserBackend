import { Router } from "express";
import usersRouter from "./users.ts";
import servicesRouter from "./services.ts";
import employeesRouter from "./employee.ts";
import appointmentsRouter from "./appointment.ts";
import authRouter from "./auth.ts";

const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/services", servicesRouter);
router.use("/employees", employeesRouter);
router.use("/appointments", appointmentsRouter);
/* router.use("/services", adminVerify, servicesRouter);
router.use("/employees", adminVerify, employeesRouter);
router.use("/appointments", adminVerify, appointmentsRouter); */

export default router;
