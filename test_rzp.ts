import { SubscriptionService } from "./services/subscription";
import { razorpay } from "./lib/razorpay";
import prisma from "./lib/db";

async function run() {
    try {
        const user = await prisma.user.findFirst();
        if (!user) return console.log("no user");

        const sub = new SubscriptionService();
        console.log("Creating order for user", user.id);
        const order = await sub.createOrder(user.id);
        console.log("Order created", order);
    } catch (e: any) {
        console.error("Error creating order:", e.response?.data || e.message || e);
    }
}

run();
