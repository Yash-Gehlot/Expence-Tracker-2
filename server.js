import express from "express";
import dotenv from "dotenv";
import path from "path"; // Node's path module to handle file/folder paths.
import { fileURLToPath } from "url"; // utility to convert file URLs to regular file paths (needed for ES modules).

import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import premiumRoutes from "./routes/premiumRoutes.js";
import forgotPasswordRoutes from "./routes/ForgetPassRoutes.js";

const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url); //Gets the current file's directory path (ES modules don't have __dirname by default).
const __dirname = path.dirname(__filename);

dotenv.config({ quiet: true });

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); // rendering static files
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/payment", paymentRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", forgotPasswordRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
