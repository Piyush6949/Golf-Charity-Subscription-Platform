import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import UserService from "@/services/user";

const User = new UserService;

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const email = formData.get('email')!.toString();
        const password = formData.get("password")!.toString();
        const data = await User.searchUser({ email, password });
        return NextResponse.redirect(new URL('/dashboard', request.url));
    } catch (error) {
        console.log(error);
        return Response.redirect(new URL('/register', request.url));
    }
}
