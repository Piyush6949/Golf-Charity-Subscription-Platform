import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import prisma from "@/lib/db";

export async function PUT(req: NextRequest) {
    try {
        const cookie = req.cookies.get('token')?.value;
        const session = await decrypt(cookie);
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { charityId, charityContribution, name } = body;

        const updateData: any = {};
        if (charityId) updateData.charityId = charityId;
        if (charityContribution) updateData.charityContribution = Number(charityContribution);
        if (name) updateData.name = name;

        const updatedUser = await prisma.user.update({
            where: { id: session.userId },
            data: updateData
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating user preferences:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
