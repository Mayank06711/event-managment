import { Router } from "express";
import { isAdmin, verifyJWT } from "../middlewares/authMiddleware";
import {} from "../controllers/bookingController.js"
const router = Router();

router.route("/").get(verifyJWT).post(verifyJWT);

router.route("/admin").get(verifyJWT, isAdmin);

export default router;
