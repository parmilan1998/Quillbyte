"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { Check } from "lucide-react";

const PERKS = [
  "Save unlimited bookmarks",
  "Track your reading history",
  "Write and publish articles",
  "Join the community",
];

import { Button } from "@/components/ui/button";
import { SITE } from "@/constants";
import RegisterForm from "@/components/sign-up-form";

export default function RegisterPage() {
  const [error, setError] = useState<String>("");

  return (
    <div className="min-h-screen flex">
      {/* Visual */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-violet to-primary p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center text-white max-w-sm"
        >
          <div className="text-5xl mb-6">✨</div>
          <h2 className="text-3xl font-bold mb-3">Create your account</h2>
          <p className="text-white/80 leading-relaxed mb-8">
            Join the community of developers who read, write, and grow together.
          </p>
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 text-sm text-left"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                {p}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/icon.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="font-bold text-lg">{SITE.name}</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
          <p className="text-muted-foreground text-sm mb-7">
            Free forever. No credit card required.
          </p>
          {error && <p className="text-sm text-danger">{error}</p>}

          {/* Register Form */}
          <RegisterForm setError={setError} />

          {/* Google + GitHub + Facebook buttons */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-3 text-muted-foreground">
                Or continue with social media
              </span>
            </div>
          </div>

          <div className="space-y-3 my-6">
            {/* GitHub + Facebook + Google*/}
            <div className="grid grid-cols-3 gap-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 cursor-pointer justify-center gap-3"
                // onClick={() => handleSocialLogin("google")}
              >
                <FcGoogle className="size-5" />
                <span className="hidden sm:inline">Google</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-11 cursor-pointer justify-center gap-2"
              >
                <FaGithub className="size-5" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-11 cursor-pointer justify-center gap-2"
              >
                <FaFacebook className="size-5 text-[#1877F2]" />
                <span className="hidden sm:inline">Facebook</span>
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
          <p className="text-center text-xs text-muted-foreground mt-4">
            By signing up you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
