import { Router } from "express";
import {
  signup,
  loginUser,
  becomeAdmin,
  logoutUser,
  refreshAccessTooken,
} from "../controllers/userController.js";
import { verifyJWT, isAdmin } from "../middlewares/authMiddleware.js";
const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(loginUser);
router.route("/admin").put(verifyJWT, becomeAdmin);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/token").post(refreshAccessTooken);

export default router;
