const sendPasswordResetMail = require("../mail/forgetPassword-mailer");
const ForgotPassword = require("../models/forgotPassModel");
const User = require("../models/userModel");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({ message: "If email exists, link sent." });
    }

    const request = await ForgotPassword.create({
      isActive: true,
      UserId: user.id,
    });

    const resetLink = `http://localhost:3000/password/resetpassword/${request.id}`;

    const client = Sib.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    await tranEmailApi.sendTransacEmail({
      sender: { email: "yashgehlot1233@gmail.com" },
      to: [{ email }],
      subject: "Reset Password",
      textContent: `Click here to reset password: ${resetLink}`,
    });

    return res.status(200).json({
      message: "Reset link sent to your email.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send reset link" });
  }
};

exports.resetPasswordPage = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Reset Request ID = ", id);

    const request = await ForgotPassword.findOne({ where: { id } });

    if (!request || request.isActive === false) {
      return res.status(400).send("Invalid or expired link");
    }

    res.send(`
  <html>
    <body>
      <form action="/password/updatepassword/${id}" method="POST">
        <label>Enter new password</label><br/>
        <input type="password" name="password" required/><br/><br/>
        <button type="submit">Update Password</button>
      </form>
    </body>
  </html>
`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const id = req.params.id;

    const request = await ForgotPassword.findOne({ where: { id } });

    if (!request || request.isActive === false) {
      return res.status(400).send("Link expired");
    }

    const user = await User.findByPk(request.UserId);

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update({ password: hashedPassword });

    await request.update({ isActive: false });

    res.send("Password updated successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating password");
  }
};
