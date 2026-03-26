import prisma from "@/lib/db";
import fs from "fs/promises";


const PRIZES: Record<number, number> = {
    3: 50,
    4: 250,
    5: 2500,
};

class AdminService {
    // ─── Users ────────────────────────────────────────────────
    async getAllUsers() {
        return prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isSubscribed: true,
                subscriptionEnd: true,
                country: true,
                charityContribution: true,
                createdAt: true,
                _count: { select: { scores: true } },
            },
        });
    }

    // ─── Draws ────────────────────────────────────────────────
    async getAllDraws() {
        return prisma.draw.findMany({
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { winners: true } } },
        });
    }

    async createDraw(numbers: number[]) {
        return prisma.draw.create({ data: { numbers } });
    }

    /**
     * Publish a draw and run winner-matching against all active users.
     * A user matches if any of their 5 latest score values appear in the drawn numbers.
     * If 3+ scores match they become a Winner entry.
     */
    async publishDraw(drawId: string) {
        const draw = await prisma.draw.findUniqueOrThrow({ where: { id: drawId } });
        if (draw.isPublished) throw new Error("Draw already published");

        const drawnSet = new Set(draw.numbers);

        // Get all subscribed users with their latest 5 scores
        const users = await prisma.user.findMany({
            where: { isSubscribed: true },
            select: {
                id: true,
                scores: {
                    orderBy: { date: "desc" },
                    take: 5,
                    select: { value: true },
                },
            },
        });

        const winnerData: {
            userId: string;
            drawId: string;
            matchCount: number;
            prize: number;
            status: string;
        }[] = [];

        for (const user of users) {
            const matchCount = user.scores.filter((s) => drawnSet.has(s.value)).length;
            if (matchCount >= 3) {
                winnerData.push({
                    userId: user.id,
                    drawId,
                    matchCount,
                    prize: PRIZES[matchCount] ?? 0,
                    status: "pending",
                });
            }
        }

        // Atomically publish + create winners
        await prisma.$transaction([
            prisma.draw.update({ where: { id: drawId }, data: { isPublished: true } }),
            ...(winnerData.length > 0
                ? [prisma.winner.createMany({ data: winnerData })]
                : []),
        ]);

        return { drawId, winnersCreated: winnerData.length };
    }

    // ─── Winners ──────────────────────────────────────────────
    async getAllWinners() {
        return prisma.winner.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                draw: { select: { createdAt: true, numbers: true } },
            },
        });
    }

    async updateWinnerStatus(winnerId: string, status: string) {
        return prisma.winner.update({
            where: { id: winnerId },
            data: { status },
        });
    }

    // ─── Overview stats ───────────────────────────────────────
    async getStats() {
        const [totalUsers, activeSubscribers, totalDraws, pendingWinners] =
            await Promise.all([
                prisma.user.count(),
                prisma.user.count({ where: { isSubscribed: true } }),
                prisma.draw.count(),
                prisma.winner.count({ where: { status: "pending" } }),
            ]);
        return { totalUsers, activeSubscribers, totalDraws, pendingWinners };
    }

}

export default AdminService;
