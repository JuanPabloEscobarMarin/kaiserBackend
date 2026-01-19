import { Router } from "express";
import {
  getAllServices,
  addService,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/services.js";

const router = Router();

router.get("/", getAllServices);
router.post("/", addService);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
