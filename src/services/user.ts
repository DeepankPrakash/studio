'use server';

import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { registerSchema } from '@/lib/schemas';

const dbPath = path.join(process.cwd(), 'src', 'database', 'users.json');
const saltRounds = 10;

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    plans?: {
        workoutPlan: string;
        dietPlan: string;
        supplementPlan: string;
    } | null;
};

async function readUsers(): Promise<User[]> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(data) as User[];
  } catch (error) {
    // If the file doesn't exist, return an empty array
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email: string): Promise<User | undefined> {
  const users = await readUsers();
  return users.find(user => user.email === email);
}

export async function createUser(data: z.infer<typeof registerSchema>): Promise<User> {
  const users = await readUsers();
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  const newUser: User = {
    id: String(users.length + 1),
    name: data.name,
    email: data.email,
    password: hashedPassword,
    plans: null,
  };
  users.push(newUser);
  await writeUsers(users);
  return newUser;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function updateUserPlans(email: string, plans: User['plans']) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex].plans = plans;
        await writeUsers(users);
    }
}
