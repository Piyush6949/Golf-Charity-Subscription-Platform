import bcrypt from 'bcrypt'
import 'dotenv/config'
import { createSession } from "@/lib/session";
import prisma from "@/lib/db";
import cloudinary from "@/lib/cloudinary";

const secretKey = process.env.SECRET_KEY;

class UserService {
    async createUser(data: { name: string, email: string, password: string }) {
        try {
            let { password } = data;
            password = await bcrypt.hash(password, 10);
            data.password = password;
            const res = await prisma.user.create({ data });
            const result = res;
            console.log(result);
            await createSession({ userId: result.id });
            return result;
        } catch (error) {
            console.log("error in service layer");
            throw error;
        }
    }

    async searchUser(data: { email: string, password: string }) {
        try {
            const res = await prisma.user.findUnique({ where: { email: data.email } });
            const { password } = data;
            if (res == null) {
                throw { error: "Email not found. Create a account first" };
            }
            else if (!(await bcrypt.compare(password, res.password))) {
                throw { error: "Wrong Password. Enter the correct password" };
            }
            await createSession({ userId: res.id });
            return res;
        } catch (error) {
            console.log("error in service layer");
            throw error;
        }
    }

    async getUserById(id: string) {
        try {
            const res = await prisma.user.findUnique({
                where: { id }, select: {
                    name: true,
                    email: true,
                    isSubscribed: true,
                    subscriptionEnd: true,
                    charityId: true,
                    charityContribution: true,
                    role: true,
                    scores: {
                        orderBy: {
                            date: "desc",
                        },
                        take: 5,
                    },
                    charity: {
                        select: { name: true, description: true, image: true }
                    },
                    winners: {
                        where: { status: "paid" },
                        orderBy: { createdAt: "desc" },
                        include: { draw: { select: { createdAt: true } } },
                        take: 3,
                    }
                }
            });
            return res;
        } catch (error) {
            console.log("error in service layer");
            throw error;
        }
    }

    async uploadProof(userId: string, proof: File) {
        try {
            const winner = await prisma.winner.findFirst({
                where: {
                    userId,
                    status: "pending",
                },
            });
            if (!winner) {
                throw new Error("Not eligible to upload proof");
            }
            if (winner.proof) {
                throw new Error("Proof already uploaded");
            }
            if (proof.size > 5 * 1024 * 1024) {
                throw new Error("File too large");
            }
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
            if (!allowedTypes.includes(proof.type)) {
                throw new Error("Invalid file type");
            }
            const buffer = Buffer.from(await proof.arrayBuffer());
            const ext = proof.name.split(".").pop()?.toLowerCase();
            const resourceType = ext === "pdf" ? "raw" : "auto";
            
            // Upload to Cloudinary using a Promise stream
            const uploadResult: any = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "golfcharity_proofs", resource_type: resourceType },
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                // Write the local buffer to the Cloudinary stream
                uploadStream.end(buffer);
            });

            const secureUrl = uploadResult.secure_url;

            await prisma.winner.update({
                where: { id: winner.id },
                data: {
                    proof: secureUrl,
                    status: "under_review",
                },
            });
            return { filename: secureUrl };
        } catch (error) {
            console.log(error);
            console.log("error in service layer");
            throw error;
        }
    }
}

export default UserService;