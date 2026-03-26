import bcrypt from 'bcrypt'
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import 'dotenv/config'
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

const secretKey = process.env.SECRET_KEY;

class ScoreService {
    async createScore(data: { value: number, date: Date, userId: string }) {
        try {
            const res = await prisma.score.create({ data });
            return res;
        } catch (error) {
            console.log("error in service layer");
            throw error;
        }
    }

    async getScores(userId: string) {
        try {
            const res = await prisma.score.findMany({
                where: { userId },
                orderBy: { date: "desc" },
                take: 5,
            });
            return res;
        } catch (error) {
            console.log("error in service layer");
            throw error;
        }
    }
}

export default ScoreService;