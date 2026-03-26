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
        let totalCharity = 0;

        for (const user of activeUsers) {
            const charityContri = user.charityContribution;
            
            // Jackpot contribution calculation
            let drawContribution = ((50 - charityContri) / 100) * submoney;
            if (drawContribution > 0) {
                totalJackpot += drawContribution;
            }

            // Charity contribution calculation
            let charityAmount = (charityContri / 100) * submoney;
            totalCharity += charityAmount;
        }

        const stats = {
            monthlyPrizes: totalJackpot,
            activeSubscribers: activeUsers.length,
            totalCharityRaised: totalCharity, // For CharityImpact.tsx perhaps
        };

        return NextResponse.json(stats);
    } catch (e) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
