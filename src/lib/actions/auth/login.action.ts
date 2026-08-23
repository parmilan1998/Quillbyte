"use server";

import { auth } from "@/lib/auth";

export async function signIn(email: string, password: string) {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return {
      success: true,
      message: "Login successful",
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.body?.message || error?.message || "Invalid email or password",
    };
  }
}
