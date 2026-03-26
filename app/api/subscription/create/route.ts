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
        const order = await subService.createOrder(session.userId);
        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Create Order Error:", error);
        let msg = typeof error === "object" ? JSON.stringify(error) : String(error);
        if (error?.error) msg = JSON.stringify(error.error);
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
