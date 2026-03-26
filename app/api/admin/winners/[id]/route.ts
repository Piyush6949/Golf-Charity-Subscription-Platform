import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import AdminService from "@/services/admin";

const admin = new AdminService();

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!(await requireAdmin(req))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    const allowed = ["pending","under_review", "approved", "rejected", "paid"];
    if (!allowed.includes(status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await admin.updateWinnerStatus(id, status);
    return NextResponse.json(updated);
}
