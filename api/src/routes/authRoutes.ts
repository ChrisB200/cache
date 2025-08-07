import { completeSignup, isAuthenticated } from "../controllers/authController";
import protectedRoute from "../middleware/protectedRoute";
import { Router } from "express";

const router = Router();

router.post("/signup/complete", protectedRoute, completeSignup);
router.get("/authenticated", protectedRoute, isAuthenticated);

export default router;
