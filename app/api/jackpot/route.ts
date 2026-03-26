import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const activeUsers = await prisma.user.findMany({
            where: { isSubscribed: true },
            select: { charityContribution: true }
        });

        const submoney = 8999;
        let totalJackpot = 0;

        for (const user of activeUsers) {
            // Formula updated: ((50 - charityContri) / 100 * submoney)
            const charityContri = user.charityContribution;
            let drawContribution = ((50 - charityContri) / 100) * submoney;
            if (drawContribution > 0) {
                totalJackpot += drawContribution;
            }
        }

        return NextResponse.json({ totalJackpot });
    } catch (e) {
        return NextResponse.json({ error: "Server Error", totalJackpot: 12500 }, { status: 500 });
    }
}
