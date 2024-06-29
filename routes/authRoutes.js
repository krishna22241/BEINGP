const express = require("express");
const { registerController,loginController,signOutController} = require("../controllers/authController");

const {isMiddleware} = require("../middlewares/authMiddlewares");
//const authMiddelware = require("../middlewares/authMiddelware");

const router = express.Router();

//routes

//REGISTER || POST


router.post("/register", registerController);
router.post("/login", loginController);
router.get("/signout", signOutController);
module.exports = router;



