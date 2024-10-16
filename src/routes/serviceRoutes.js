import { Router } from "express";
import { verifyJWT, isAdmin } from "../middlewares/authMiddleware.js";
import {} from "../controllers/serviceController.js";
const router = Router();

router.route("/").get().post(verifyJWT, isAdmin);

router
  .route("/:id")
  .get()// no need to authenticate
  .patch(verifyJWT, isAdmin)
  .delete(verifyJWT, isAdmin);
export default router;
