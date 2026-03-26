import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import AdminService from "@/services/admin";

const admin = new AdminService();

export async function GET(req: NextRequest) {
    if (!(await requireAdmin(req))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const draws = await admin.getAllDraws();
    console.log(draws);
    return NextResponse.json(draws);
}

function randomise() {
    const nums: number[] = [];
    while (nums.length < 5) {
        const n = Math.floor(Math.random() * 45) + 1;
        if (!nums.includes(n)) nums.push(n);
    }
    return nums;
}

export async function POST(req: NextRequest) {
    if (!(await requireAdmin(req))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const numbers = randomise();

    const draw = await admin.createDraw(numbers);
    return NextResponse.json(draw, { status: 201 });
}
