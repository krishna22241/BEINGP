const express = require("express");

const router = express.Router();

const {totalRequest, pendingRequest,approvedRequest,rejectedRequest} = require("../controllers/requests");
const {isMiddleware,isDonor} = require("../middlewares/authMiddlewares");


//for donor
router.get("/donor/home", isMiddleware, isDonor, async (req, res) => {
   
        const total = await totalRequest(req, res);
        const pending = await pendingRequest(req, res);
        const approved = await approvedRequest(req, res);
        const rejected = await rejectedRequest(req, res);

        // Render the EJS file with the counts
        res.render("donorHome", { total, pending, approved, rejected });
});



module.exports = router;