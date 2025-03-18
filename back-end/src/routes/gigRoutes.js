import express from "express";
const router = express.Router()

import { postGig } from "../controllers/gigController.js";
import gigValidationSchema from "../validations/gigValidation.js";
import checkValidationError from "../middlewares/checkValidationError.js";

router.route('/postgig').post(gigValidationSchema, checkValidationError, postGig)

export default router