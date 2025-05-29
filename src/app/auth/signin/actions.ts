"use server";

import { z } from "zod";
import { createSession, deleteSession } from "../../lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
const bcrypt = require('bcryptjs');

const loginSchema = z.object({
  email: z.string()
    .email({ message: "Invalid email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { 
      message: "Email must contain a valid domain and follow standard email format" 
    })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

export async function login(prevState: any, formData: FormData) {
  const rawEmail = formData.get("email")?.toString() || "";

  // Validate form data first
  const result = loginSchema.safeParse(Object.fromEntries(formData));
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      email: rawEmail,
    };
  }

  // Then check for user
  const testUser = await prisma.user.findUnique({
    where: { email: rawEmail },
  });

  if (!testUser) {
    return {
      errors: { email: ["Invalid email or password"] },
      email: rawEmail,
    };
  }

  const { password } = result.data;
  const comparison = await bcrypt.compare(password, testUser.password);
  if (!comparison) {
    return {
      errors: { email: ["Invalid email or password"] },
      email: rawEmail,
    };
  }

  await createSession(testUser.id.toString(), testUser.name || "Update name", testUser.email);

  redirect("/home");
}

export async function logout() {
  await deleteSession();
  redirect("/auth/signin");
}