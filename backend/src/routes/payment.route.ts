import { Router } from "express";
import { 
  createSubscriptionPaymentController, 
  handlePaymentNotificationController 
} from "../controllers/payment.controller";
import { passportAuthenticateJwt } from "../config/passport.config";

const router = Router();

// Create subscription payment
router.post("/create-subscription", passportAuthenticateJwt, createSubscriptionPaymentController);

// Midtrans notification endpoint (public endpoint, no auth required)
router.post("/notification", handlePaymentNotificationController);

export default router;