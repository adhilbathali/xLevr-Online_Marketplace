const express = require("express");
const router = express.Router();

const { postGig } = require("../controllers/gigController");
const gigValidationSchema = require("../validations/gigValidation");
const checkValidationError = require("../middlewares/checkValidationError");
const acceptGig = require("../controllers/acceptGigController")
const rejectGig = require("../controllers/rejectGigController");
const approveGig = require("../controllers/approveGigController");
const { getGigsStudent, getGigsProfessional } = require("../controllers/getGigsController")

router.route('/postgig').post(gigValidationSchema, checkValidationError, postGig);
router.route('/accept/:id').post(acceptGig);
router.route('/reject/:id').post(rejectGig);
router.route('/approve/:id').post(approveGig);
router.route('/student/dashboard/:id').get(getGigsStudent)
router.route('/professional/dashboard/:id').get(getGigsProfessional)

module.exports = router;