"use server";

import { auth } from "@/lib/auth";

export async function signUp(name: string, email: string, password: string) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
    });

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || "Unable to create account. Please try again.",
    };
  }
}
