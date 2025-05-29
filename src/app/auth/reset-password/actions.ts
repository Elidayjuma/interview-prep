"use server";

import { z } from "zod";
import prisma from "@/lib/db";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";
const bcrypt = require('bcryptjs');


const resetPasswordSchema = z.object({
  email: z.string()
    .email({ message: "Invalid email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { 
      message: "Email must contain a valid domain and follow standard email format" 
    })
    .trim(),
});

const resetPasswordWithTokenSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  confirm: z.string(),
}).refine((data) => data.password === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});
export async function verifyResetToken(token: string) {
  const dbToken = await prisma.token.findUnique({
    where: { value: token, name: "password_reset" },
    include: { user: true },
  });
  if (!dbToken || dbToken.expiresAt < new Date()) return false;
  return true;
}

export async function resetPasswordWithToken(token: string, newPassword: string, confirm: string) {
  const result = resetPasswordWithTokenSchema.safeParse({ password: newPassword, confirm });
  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }
  const dbToken = await prisma.token.findUnique({
    where: { value: token, name: "password_reset" },
    include: { user: true },
  });
  if (!dbToken || dbToken.expiresAt < new Date()) {
    return { success: false, error: "Invalid or expired token." };
  }
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: dbToken.userId },
    data: { password: hashed },
  });
  await prisma.token.delete({ where: { id: dbToken.id } });
  return { success: true };
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
  const result = resetPasswordSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const { email } = result.data;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      errors: { email: ["No account found with this email address"] },
    };
  }

  // Generate reset token
  const resetToken = randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

  await prisma.token.create({
    data: {
      name: "password_reset",
      value: resetToken,
      expiresAt: resetTokenExpiry,
      userId: user.id,
    },
  });

  // Send reset email
  const resetUrl = `${process.env.BASE_URL}/auth/reset-password/token/${resetToken}`;
  await sendPasswordResetEmail(email, resetUrl);

  return {
    success: "Password reset instructions have been sent to your email",
  };
} 