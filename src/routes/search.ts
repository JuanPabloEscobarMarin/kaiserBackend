import { Router } from "express";
import SearchController from "../controllers/search.ts";

const router = Router();

// GET /api/search?q=corte+de+pelo
router.get("/", SearchController.search);

export default router;
