const User = require("../models/userModel");
const Sib = require("sib-api-v3-sdk");
require("dotenv").config();

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    const client = Sib.ApiClient.instance;
    client.authentications["api-key"].apiKey = process.env.SENDINBLUE_API_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    await tranEmailApi.sendTransacEmail({
      sender: { email: "yashgehlot1233@gmail.com" },
      to: [{ email }],
      subject: "Dummy Password Reset Email",
      textContent: "This is a dummy reset password email.",
    });

    res.status(200).json({
      message: "Reset email sent",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
};
