import ServicesController from "../controllers/services.ts";
import { Router } from "express";

const router = Router();

router.get("/", ServicesController.getAll);
router.get("/:id", ServicesController.getById);
router.post("/", ServicesController.save);
router.put("/:id", ServicesController.update);
router.delete("/:id", ServicesController.delete);

export default router;
