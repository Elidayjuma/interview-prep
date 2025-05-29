"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
const bcrypt = require('bcryptjs');

type FormState = {
  errors?: {
    full_name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
  email?: string;
  password?: string;
  name?: string;

};

const signupSchema = z.object({
  full_name: z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(50, { message: "Name must be less than 50 characters" })
    .trim(),
  email: z.string()
    .email({ message: "Invalid email address" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { 
      message: "Email must contain a valid domain and follow standard email format" 
    })
    .trim(),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" })
    .trim(),
  password_confirmation: z.string()
    .trim()
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});


export async function createUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const result = signupSchema.safeParse(Object.fromEntries(formData));
  const rawEmail = formData.get("email")?.toString() || "";


  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      email: rawEmail,
      password: formData.get("password")?.toString() || "",
      name: formData.get("full_name")?.toString() || "",
    };
  }

  const { full_name, email, password } = result.data;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      errors: { email: ["Email already in use"] },
      email, password, name: full_name,
    };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  await prisma.user.create({
    data: {
      email: formData.get("email") as string,
      name: formData.get("full_name") as string,
      password: hashedPassword,
  
    },
  });

  redirect("/auth/signin");
} 