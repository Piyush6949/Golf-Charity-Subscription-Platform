import prisma from "@/lib/db";

class DrawService {
    /** Returns the most recent published draw + the user's winner record (if any) */
    async getLatestDraw(userId: string) {
        const draw = await prisma.draw.findFirst({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
            include: {
                winners: {
                    where: { userId },
                },
            },
        });
        return draw;
    }

    /** Returns all published draws with the user's winner entries */
    async getDrawHistory(userId: string) {
        const draws = await prisma.draw.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: "desc" },
            include: {
                winners: {
                    where: { userId },
                },
            },
        });
        return draws;
    }
}

export default DrawService;
