import multer from "multer";
import ResourcesController from "../controllers/resources.controller.ts";
import { Router } from "express";

const router = Router();
const upload = multer();

router.get("/images/:slug", ResourcesController.getImageBySlug);
router.post("/images", upload.single("image"), ResourcesController.storeImage);

export default router;