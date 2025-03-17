import authRouter from "./authRoutes.js";
import gigRouter from "./gigRoutes.js";
import express from "express";
const router = express.Router()

router.use('/user', authRouter)
router.use('/gigs', gigRouter)

export default router;