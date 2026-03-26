import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import prisma from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const { id } = await params;
        const body = await req.json();
        const { name, description, image } = body;

        const updated = await prisma.charity.update({
            where: { id },
            data: {
                ...(name && { name }),
                ...(description && { description }),
                ...(image !== undefined && { image })
            }
        });

        return NextResponse.json(updated);
    } catch (e: any) {
        return NextResponse.json({ error: "Update failed" }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const { id } = await params;
        // Find users assigned to this charity to nullify their assignment before deleting
        await prisma.user.updateMany({
            where: { charityId: id },
            data: { charityId: null }
        });

        await prisma.charity.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to delete charity" }, { status: 400 });
    }
}
