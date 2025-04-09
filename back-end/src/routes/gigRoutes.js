const express = require("express");
const router = express.Router();

const { postGig } = require("../controllers/gigController");
const gigValidationSchema = require("../validations/gigValidation");
const checkValidationError = require("../middlewares/checkValidationError");
const acceptGig = require("../controllers/acceptGigController")
const rejectGig = require("../controllers/rejectGigController");
const { getGigs } = require("../controllers/getGigsController")

router.route('/postgig').post(gigValidationSchema, checkValidationError, postGig);
router.route('/gig/:id/accept').post(acceptGig);
router.route('/gig/:id/reject').post(rejectGig);
router.route('/student/dashboard/:id').get(getGigs)

module.exports = router;