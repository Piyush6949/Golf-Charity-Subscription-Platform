import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db"; // adjust if your path differs
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import ScoreService from "@/services/score";

const score = new ScoreService();

//  GET: fetch latest 5 scores

export async function GET(req: NextRequest) {
    try {
        const cookie = req.cookies.get('token')?.value;
        const session = await decrypt(cookie);
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const scores = await score.getScores(session.userId);

        return Response.json(scores);
    } catch (err) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
}

//  POST: add score (keep only latest 5)

export async function POST(req: NextRequest) {
    try {
        const cookie = req.cookies.get('token')?.value;
        const session = await decrypt(cookie);
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        
        const userId = session.userId;
        const body = await req.json();
        const { date } = body;
        const date1 = new Date(date);
        const value = body.value;
        const points = parseInt(value);
        console.log(points);
        // validation
        if (!points || points < 1 || points > 45) {
            return Response.json(
                { error: "Invalid score (1–45)" },
                { status: 400 }
            );
        }

        if (!date1) {
            return Response.json(
                { error: "Date required" },
                { status: 400 }
            );
        }

        //  create new score
        const newScore = await score.createScore({
            value: points,
            date: date1,
            userId,
        });

        return Response.json(newScore);
    } catch (err) {
        console.error(err);
        return Response.json({ error: "Failed" }, { status: 500 });
    }
}