import EmployeeController from "../controllers/employees.controller.ts";
import { Router } from "express";
import { adminVerify } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get("/", EmployeeController.getAll);
router.get("/service/:id", EmployeeController.getByServiceId);
router.get("/:id", EmployeeController.getById);
router.post("/", adminVerify, EmployeeController.save);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);

export default router;
