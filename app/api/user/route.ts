import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import UserService from "@/services/user";

const user = new UserService();


// used to get user data for dashboard
export async function GET(req: NextRequest) {
    const cookie = req.cookies.get('token')?.value
    const session = await decrypt(cookie)
    if (!session?.userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userData = await user.getUserById(session.userId);

    return NextResponse.json(userData);
}