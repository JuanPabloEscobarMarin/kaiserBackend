import UsersController from "../controllers/users.ts";
import { Router } from "express";

const router = Router();

router.get("/", UsersController.getAll);
router.get("/:id", UsersController.getById);
router.post("/", UsersController.save);
router.put("/:id", UsersController.update);
router.delete("/:id", UsersController.delete);

export default router;
