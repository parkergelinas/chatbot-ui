// pages/api/password-check.ts
import type { NextApiRequest, NextApiResponse } from "next";

const MAX_ATTEMPTS = 5;
const TIME_WINDOW_MS = 60 * 1000; // 1 minute
const attemptStore: Record<string, number[]> = {};

function getClientIP(req: NextApiRequest): string {
  const ip = req.headers['x-real-ip'] || req.socket.remoteAddress;
  if (Array.isArray(ip)) {
    return ip[0] || 'unknown';
  } else {
    return ip || 'unknown';
  }
}

function isRateLimited(ip: string): boolean {
  if (!attemptStore[ip]) {
    attemptStore[ip] = [];
  }

  const currentTime = Date.now();
  attemptStore[ip] = attemptStore[ip].filter(timestamp => currentTime - timestamp < TIME_WINDOW_MS);

  cleanupExpiredAttempts(ip, currentTime);

  if (attemptStore[ip].length >= MAX_ATTEMPTS) {
    return true;
  }

  attemptStore[ip].push(currentTime);
  return false;
}

function cleanupExpiredAttempts(ip: string, currentTime: number): void {
  attemptStore[ip] = attemptStore[ip].filter(timestamp => currentTime - timestamp < TIME_WINDOW_MS);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const inputPassword = req.body.password;
  const ip = getClientIP(req);

  if (isRateLimited(ip)) {
    res.status(429).json({ success: false, message: "Too many attempts. Please try again later." });
    return;
  }

  const correctPassword = process.env.PASSWORD;

  if (inputPassword === correctPassword) {
    res.status(200).json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
}