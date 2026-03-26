import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import AdminService from "@/services/admin";
import { decrypt } from "@/lib/session";

const admin = new AdminService();

export async function GET(req: NextRequest) {
    if (!(await requireAdmin(req))) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const winners = await admin.getAllWinners();
    console.log("winners", winners);
    return NextResponse.json(winners);
}

// export async function POST(req: NextRequest) {
//     const formData = await req.formData();
//     const proof = formData.get("proof") as File;

//     //use decrypt here (cookie)
//     const session = await req.cookies.get("token")?.value;
//     const user = await decrypt(session);

//     if (!proof || !user) {
//         return NextResponse.json({ error: "Missing proof or user" }, { status: 400 });
//     }
//     const result = await admin.uploadProof(user.id, proof);
//     if (!result) {
//         return NextResponse.json({ error: "Failed to upload proof" }, { status: 500 });
//     }
//     return NextResponse.json(result);
// }   

// export async function POST(req: NextRequest) {
//   const formData = await req.formData();
//   const file = formData.get("proof") as File;

//   const user = await getUserFromToken(req); // your helper

//   const result = await winnerService.uploadProof(user.id, file);

//   return NextResponse.json(result);
// }
