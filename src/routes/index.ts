import { Router } from "express";
import usersRouter from "./users.ts";

const router = Router();

// router.use("/auth", authRouter);
router.use("/users", usersRouter);
/* router.use("/services", adminVerify, servicesRouter);
router.use("/employees", adminVerify, employeesRouter);
router.use("/appointments", adminVerify, appointmentsRouter); */

export default router;
