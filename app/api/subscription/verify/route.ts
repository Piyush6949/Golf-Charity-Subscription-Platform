import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import { SubscriptionService } from "@/services/subscription";

const subService = new SubscriptionService();

export async function POST(req: NextRequest) {
    const cookie = req.cookies.get("token")?.value;
    const session = await decrypt(cookie);

    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = body;

        if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
            return NextResponse.json({ error: "Missing required payment fields" }, { status: 400 });
        }

        const result = await subService.verifyPayment(
            session.userId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature
        );

        return NextResponse.json(result);
    } catch (error: any) {
        console.error("Verify Payment Error:", error);
        return NextResponse.json({ error: error?.message || "Payment verification failed" }, { status: 400 });
    }
}
