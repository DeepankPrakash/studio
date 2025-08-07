
'use server';

import fs from 'fs/promises';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database', 'users.json');

export type User = {
    id: string;
    name: string;
    email: string;
    password?: string; // Made password optional as it's not used post-login removal
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
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeUsers(users: User[]): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(users, null, 2));
}

export async function getFirstUser(): Promise<User | undefined> {
  const users = await readUsers();
  return users[0];
}


export async function updateUserPlans(email: string, plans: User['plans']) {
    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users[userIndex].plans = plans;
        await writeUsers(users);
    }
}
