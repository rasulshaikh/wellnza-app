"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";

/**
 * Server Action for credentials login.
 *
 * Using a server action (rather than client-side signIn + redirect) is the
 * NextAuth v5 recommended pattern. The server sets the session cookie and
 * performs the redirect in the same response — no race between cookie
 * propagation and the RSC render of the destination page.
 */
export async function loginAction(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/account",
    });
    // signIn with redirectTo throws a NEXT_REDIRECT internally — we never
    // reach this line on success.
    return null;
  } catch (error) {
    // Re-throw NEXT_REDIRECT so Next.js can handle the navigation.
    if (
      error instanceof Error &&
      "digest" in error &&
      typeof (error as { digest?: string }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    if (error instanceof AuthError) {
      return "Invalid email or password. Please try again.";
    }
    console.error("[loginAction]", error);
    return "Something went wrong. Please try again.";
  }
}
