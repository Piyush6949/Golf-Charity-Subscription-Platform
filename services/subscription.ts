import prisma from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import crypto from "crypto";

export class SubscriptionService {
    /**
     * Creates a new Razorpay order for the subscription.
     * Hardcoded price for now: ₹89.99 = 8999 INR (example, usually you calculate via currencies and cents/paise).
     * Assuming 899900 paise for ₹8999.
     */
    async createOrder(userId: string) {
        const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

        // Amount in currency's smallest unit (paise for INR). Let's say 8999 INR for yearly sub.
        const options = {
            amount: 899900, // 8999.00
            currency: "INR",
            receipt: `rct_${user.id.substring(0, 8)}_${Date.now()}`,
            notes: {
                userId: user.id,
                email: user.email,
            },
        };

        const order = await razorpay.orders.create(options);

        // Store the order ID in the user record
        await prisma.user.update({
            where: { id: userId },
            data: { razorpayOrderId: order.id },
        });

        return order;
    }

    /**
     * Verifies the Razorpay payment signature.
     * If valid, marks the user as subscribed.
     */
    async verifyPayment(
        userId: string,
        razorpayPaymentId: string,
        razorpayOrderId: string,
        razorpaySignature: string
    ) {
        const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });

        if (user.razorpayOrderId !== razorpayOrderId) {
            throw new Error("Order ID mismatch / Invalid Order");
        }

        const secret = process.env.RAZORPAY_KEY_SECRET || "";

        // Verify signature
        const hmac = crypto.createHmac("sha256", secret);
        hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);
        const generatedSignature = hmac.digest("hex");

        if (generatedSignature !== razorpaySignature) {
            throw new Error("Invalid payment signature");
        }

        // Signature is valid. Update user.
        // Grant 1 year of subscription
        const subscriptionEnd = new Date();
        subscriptionEnd.setFullYear(subscriptionEnd.getFullYear() + 1);

        await prisma.user.update({
            where: { id: userId },
            data: {
                isSubscribed: true,
                subscriptionEnd,
                razorpayPaymentId,
                // optionally we could clear the order ID or keep it for history
            },
        });

        return { success: true };
    }
}
