const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

router.post("/login", authController.postLogin);
router.post("/signup", authController.postSignup);
router.post("/getChangePassword", authController.sendResetLink);

// router.post("/changePassword", authController.changePassword);
// router.get("/changePassword", authController.getChangePassword);

module.exports = router;
