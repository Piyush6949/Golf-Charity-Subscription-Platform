import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

type SessionPayload = {
    userId: string;
    iat: number;
    exp: number;
};


const secretKey = process.env.SECRET_KEY;


export async function createSession(payload: { userId: string }) {
    const cookieStore = await cookies();

    const token = jwt.sign(payload, secretKey!, {
        expiresIn: '7d',
    });

    cookieStore.set('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return token;
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('token');
}

export async function updateSession() {
  const session = (await cookies()).get('token')?.value
  const payload = await decrypt(session)
 
  if (!session || !payload) {
    return null
  }
 
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
 
  const cookieStore = await cookies()
  cookieStore.set('token', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function decrypt(data: undefined | string) {
    if (data == null) {
        return null;
    }
    const res = await jwt.verify(data, secretKey!) as SessionPayload;
    return res;
}
