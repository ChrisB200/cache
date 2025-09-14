import { Router } from "express";
import protectedRoute from "../middleware/protectedRoute";
import { getShift, getShifts } from "../controllers/shiftController";

const router = Router();

router.get("/", protectedRoute, getShifts);
router.get("/:id", protectedRoute, getShift);

export default router;
