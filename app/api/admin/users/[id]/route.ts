import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            scores: { orderBy: { date: "desc" } },
            charity: true,
        }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, email, isSubscribed, subscriptionEnd, charityContribution } = body;

        const updated = await prisma.user.update({
            where: { id },
            data: {
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(isSubscribed !== undefined && { isSubscribed }),
                ...(subscriptionEnd !== undefined && { subscriptionEnd: subscriptionEnd ? new Date(subscriptionEnd) : null }),
                ...(charityContribution !== undefined && { charityContribution: Number(charityContribution) }),
            }
        });

        return NextResponse.json(updated);
    } catch (e: any) {
        return NextResponse.json({ error: e.message || "Update failed" }, { status: 400 });
    }
}
