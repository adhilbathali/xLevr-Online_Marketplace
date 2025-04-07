const express = require("express");
const router = express.Router();

const { postGig } = require("../controllers/gigController");
const gigValidationSchema = require("../validations/gigValidation");
const checkValidationError = require("../middlewares/checkValidationError");

router.route('/postgig').post(gigValidationSchema, checkValidationError, postGig);

module.exports = router;