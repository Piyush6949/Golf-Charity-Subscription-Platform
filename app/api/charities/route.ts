import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
    try {
        const charities = await prisma.charity.findMany({
            orderBy: { name: "asc" }
        });
        return NextResponse.json(charities);
    } catch (error) {
        console.error("Error fetching charities:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
