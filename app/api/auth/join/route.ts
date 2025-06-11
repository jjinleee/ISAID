import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      name,
      eng_name,
      email,
      password,
      rrn,
      phone,
      address,
      telno
    } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        eng_name,
        email,
        password: hashedPassword,
        rrn,
        phone,
        address,
        telno,
      },
    });

    const token = jwt.sign(
      { user_id: newUser.user_id, email: newUser.email },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ user_id: newUser.user_id, token });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}