const functions = require("firebase-functions");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });

// Initialize Razorpay with your CREDENTIALS
// IMPORTANT: Replace 'YOUR_KEY_SECRET' with the actual secret from Razorpay Dashboard
const razorpay = new Razorpay({
    key_id: "rzp_test_Rjy0Hn2Ns66KiP", // Public Key (Safe to be here, but better in env vars)
    key_secret: process.env.RAZORPAY_KEY_SECRET, // <--- Loaded from functions/.env
});

exports.createPaymentOrder = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        if (req.method !== 'POST') {
            return res.status(405).send('Method Not Allowed');
        }

        try {
            const { amount } = req.body;

            if (!amount) {
                return res.status(400).json({ error: "Amount is required" });
            }

            const options = {
                amount: Math.round(amount * 100), // Convert to paise (integers)
                currency: "INR",
                receipt: `receipt_${Date.now()}`,
            };

            const order = await razorpay.orders.create(options);
            res.json(order);
        } catch (error) {
            console.error("Razorpay Error:", error);
            res.status(500).json({ error: error.message });
        }
    });
});
