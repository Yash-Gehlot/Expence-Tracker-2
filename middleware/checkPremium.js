// middleware/checkPremium.js
module.exports = (req, res, next) => {
  // assumes authenticate middleware already set req.user (Sequelize instance or plain object)
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  // if req.user is Sequelize model instance, use req.user.isPremium, else req.user.isPremium
  const isPremium =
    req.user.isPremium || (req.user.get && req.user.get("isPremium"));

  console.log("Premium status:", req.user.isPremium);

  if (!isPremium) {
    return res.status(403).json({ message: "Premium required" });
  }
  next();
};
