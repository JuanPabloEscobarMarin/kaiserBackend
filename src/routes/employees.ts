import EmployeesController from "../controllers/employees.ts";
import { Router } from "express";

const router = Router();

router.get("/", EmployeesController.getAll);
router.get("/:id", EmployeesController.getById);
router.post("/", EmployeesController.save);
router.put("/:id", EmployeesController.update);
router.delete("/:id", EmployeesController.delete);

export default router;
