const express = require("express");

const {donorRequest , patientRequest} = require("../controllers/donor");

const {isMiddleware,isDonor,isPatient } = require("../middlewares/authMiddlewares");


const router = express.Router();




router.post("/donorReq",isMiddleware, isDonor ,donorRequest);

router.post("/patientReq",isMiddleware, isPatient ,patientRequest);



module.exports = router;