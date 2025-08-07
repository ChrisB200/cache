import { Router } from "express";
import protectedRoute from "../middleware/protectedRoute";
import { setupFiveGuys } from "../controllers/userController";

const router = Router();

router.post("/setup/fiveguys", protectedRoute, setupFiveGuys);

export default router;
