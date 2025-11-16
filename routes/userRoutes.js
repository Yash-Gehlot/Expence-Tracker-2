const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUserDetails,
} = require("../controllers/userController");
const authenticate = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/details", authenticate, getUserDetails);

module.exports = router;
