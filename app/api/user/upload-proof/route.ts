import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/session";
import UserService from "@/services/user";

const user = new UserService();

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const proof = formData.get("proof") as File;

    const cookie = await req.cookies.get("token")?.value;
    const session = await decrypt(cookie);
    try {
        if (!proof || !session) {
            return NextResponse.json({ error: "Missing proof or user" }, { status: 400 });
        }
        const result = await user.uploadProof(session.userId, proof);
        if (!result) {
            return NextResponse.json({ error: "Failed to upload proof" }, { status: 500 });
        }
        return NextResponse.json(result);
    } catch (error) {
        console.log("error in uploading");
        return NextResponse.json({ error: error }, { status: 500 });
    }
}  