// routes/premiumRoutes.js
const express = require("express");
const router = express.Router();

const premiumController = require("../controllers/premiumController");
const authenticate = require("../middleware/auth");
const checkPremium = require("../middleware/checkPremium");

// GET /premium/leaderboard
router.get("/leaderboard", authenticate, premiumController.getLeaderboard);

module.exports = router;
