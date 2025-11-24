const express = require("express");
const app = express();

require("dotenv").config();

const db = require("./config/db");
const path = require("path");

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "views")));

// default Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

// Routes
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);

const expenseRoutes = require("./routes/expenseRoutes");
app.use("/expense", expenseRoutes);

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/payment", paymentRoutes);

const premiumRoutes = require("./routes/premiumRoutes");
app.use("/premium", premiumRoutes);

const forgotPasswordRoutes = require("./routes/ForgetPassRoutes");
app.use("/password", forgotPasswordRoutes);

const PORT = process.env.PORT;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

(async () => {
  try {
    await db.sync({ force: false });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
