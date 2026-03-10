import EmployeeController from "../controllers/employee.ts";
import { Router } from "express";

const router = Router();

router.get("/", EmployeeController.getAll);
router.get("/service/:id", EmployeeController.getByServiceId);
router.get("/:id", EmployeeController.getById);
router.post("/", EmployeeController.save);
router.put("/:id", EmployeeController.update);
router.delete("/:id", EmployeeController.delete);

export default router;
