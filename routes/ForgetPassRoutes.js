const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  resetPasswordPage,
  updatePassword,
} = require("../controllers/ForgotPassController");

router.post("/forgotpassword", forgotPassword);
router.get("/resetpassword/:id", resetPasswordPage);
router.post("/updatepassword/:id", updatePassword);

module.exports = router;
