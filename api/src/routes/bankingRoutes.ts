import { Router } from "express";
import {
  changeBankPosition,
  createLinkToken,
  exchangePublicToken,
  getBankCards,
  updateNickname,
} from "../controllers/bankingController";
import protectedRoute from "../middleware/protectedRoute";

const router = Router();

router.get("/create_link_token", protectedRoute, createLinkToken);
router.post("/exchange_public_token", protectedRoute, exchangePublicToken);
router.get("/cards", protectedRoute, getBankCards);
router.post("/:bank_account_id/nickname", protectedRoute, updateNickname);
router.post(
  "/accounts/:bank_account_id/position/move",
  protectedRoute,
  changeBankPosition,
);

export default router;
