"use client";

import { useState } from "react";
import { Zap, Lock, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SITE } from "@/constants";
import { authClient } from "@/lib/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// This is the page better-auth's reset email links point at (see
// redirectTo in the forgot-password page and src/lib/email.ts) — it
// didn't exist at all before, so the reset flow had no way to actually
// complete even once the email itself became real.
export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: resetError } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setLoading(false);
    if (resetError) {
      setError(resetError.message ?? "This reset link is invalid or has expired.");
    } else {
      setDone(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">{SITE.name}</span>
        </Link>

        <div className="bg-card border rounded-2xl p-8">
          {!token ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-danger/15 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-danger" />
              </div>
              <h2 className="text-xl font-bold mb-2">Invalid link</h2>
              <p className="text-sm text-muted-foreground mb-6">
                This password reset link is missing or invalid. Request a
                new one below.
              </p>
              <Button asChild className="w-full cursor-pointer">
                <Link href="/auth/forgot-password">Request New Link</Link>
              </Button>
            </div>
          ) : done ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-success" />
              </div>
              <h2 className="text-xl font-bold mb-2">Password reset</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Your password has been changed. You can sign in now.
              </p>
              <Button
                className="w-full cursor-pointer"
                onClick={() => router.push("/auth/sign-in")}
              >
                Sign In
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold">Set a new password</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="password">New password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={error ? "border-danger" : ""}
                  />
                  {error && <p className="text-xs text-danger">{error}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : null}
                  Reset Password
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
