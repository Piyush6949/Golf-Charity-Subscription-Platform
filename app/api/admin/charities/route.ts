import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import prisma from "@/lib/db";

export async function POST(req: NextRequest) {
    if (!(await requireAdmin(req))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    try {
        const body = await req.json();
        const { name, description, image } = body;
        
        if (!name || !description) {
            return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
        }

        const charity = await prisma.charity.create({
            data: { name, description, image }
        });

        return NextResponse.json(charity, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: "Failed to create charity" }, { status: 400 });
    }
}
