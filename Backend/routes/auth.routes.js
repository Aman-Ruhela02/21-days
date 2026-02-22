import express from "express";
import {auth} from "../middlewares/auth.middleware.js"
import { register, login, getMe } from "../controllers/auth.controller.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me",auth, getMe);

export default router;
