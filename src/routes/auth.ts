import { Router } from "express";
import { check, login, logout } from "../controllers/auth.ts";
import { adminVerify } from "../middlewares/auth.middleware.ts";

const router = Router();

router.get("/check", adminVerify, check);
router.post("/login", login);
router.post("/logout", logout);

export default router;
