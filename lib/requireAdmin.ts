import { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";
import prisma from "@/lib/db";

/** Returns the user record if they are an ADMIN, otherwise null. */
export async function requireAdmin(req: NextRequest) {
    const cookie = req.cookies.get("token")?.value;
    const session = await decrypt(cookie);
    if (!session?.userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { id: true, role: true },
    });

    if (!user || user.role !== "ADMIN") return null;
    return user;
}
