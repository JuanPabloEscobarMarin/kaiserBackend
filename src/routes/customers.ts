import { Router } from "express";
import CustomersController from "../controllers/customers.controller.ts";

const router = Router();

router.get("/", CustomersController.getAll);
router.get("/appointment/:id", CustomersController.getManyByAppointmentId);

export default router;
