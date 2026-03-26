import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import AdminService from "@/services/admin";

const admin = new AdminService();

export async function GET(req: NextRequest) {
    if (!(await requireAdmin(req))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const stats = await admin.getStats();
    return NextResponse.json(stats);
}
