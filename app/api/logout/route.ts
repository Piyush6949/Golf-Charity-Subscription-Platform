import type { NextRequest } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST(request: NextRequest) {
    try {
        await deleteSession();

        return Response.json({ message: "Logged out" });
    } catch (error) {
        console.log(error);

        return Response.json(
            { error: "Logout failed" },
            { status: 500 }
        );
    }
}