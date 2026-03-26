import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import prisma from "@/lib/db";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string, scoreId: string }> }) {
    if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const { scoreId } = await params;
        await prisma.score.delete({
            where: { id: scoreId }
        });
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to delete score" }, { status: 400 });
    }
}
