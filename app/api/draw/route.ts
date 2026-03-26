import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import DrawService from "@/services/draw";

const drawService = new DrawService();

export async function GET(req: NextRequest) {
    try {
        const cookie = req.cookies.get("token")?.value;
        const session = await decrypt(cookie);
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const [latestDraw, history] = await Promise.all([
            drawService.getLatestDraw(session.userId),
            drawService.getDrawHistory(session.userId),
        ]);

        return NextResponse.json({ latestDraw, history });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
