import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import prisma from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { value, date } = body;
        
        if (!value || value < 1 || value > 45 || !date) {
            return NextResponse.json({ error: "Invalid score or date" }, { status: 400 });
        }

        const score = await prisma.score.create({
            data: {
                userId: id,
                value: parseInt(value),
                date: new Date(date)
            }
        });

        return NextResponse.json(score);
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to create score" }, { status: 400 });
    }
}
