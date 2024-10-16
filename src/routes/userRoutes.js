import {Router} from "express"
import {} from "../controllers/userController.js"
import {} from "../controllers/adminController.js"
import {verifyJWT, isAdmin} from "../middlewares/authMiddleware.js"
const router = Router();

router.route('/signup').post();
router.route('/login').post();

export default router;
