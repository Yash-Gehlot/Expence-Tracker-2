import Razorpay from "razorpay";
import crypto from "crypto";

import User from "../models/userModel.js";

export const createOrder = async (req, res) => {
  try {
    const razorpay = new Razorpay({
      //Creates Razorpay instance with API credentials
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: 49900, // ₹499 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options); // calls Razorpay API and creates an order:

    res.status(200).json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error("********* Error creating Razorpay order:********* ", err);
    res.status(500).json({ error: "Error creating Razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    //After user completes payment, Razorpay sends:
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const userId = req.user.id;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      await User.update({ isPremium: true }, { where: { id: userId } });
      return res
        .status(200)
        .json({ success: true, message: "Payment verified successfully" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
