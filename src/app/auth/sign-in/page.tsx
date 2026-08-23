"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebook } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SITE } from "@/constants";
import { PageLoader } from "@/components/ui/page-loader";
import LoginForm from "@/components/sign-in-form";

export default function LoginPage() {
  const [isNavigating, setIsNavigating] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Navigating overlay */}
      {isNavigating && <PageLoader />}

      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/icon.svg" alt="Logo" width={24} height={24} />
            </div>
            <span className="font-bold text-lg">{SITE.name}</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-7">
            Sign in to your account to continue
          </p>

          {/* Sign In Form */}
          <Suspense
            fallback={
              <div className="space-y-4 animate-pulse">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-10 bg-muted rounded w-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-10 bg-muted rounded w-full" />
                </div>
                <div className="h-10 bg-muted rounded w-full" />
              </div>
            }
          >
            <LoginForm setIsNavigating={setIsNavigating} />
          </Suspense>

          {/* Separator */}
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

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/sign-up"
              className="text-primary font-semibold hover:underline"
            >
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 bg-linear-to-br from-primary to-violet p-12 items-center justify-center">
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-center text-white max-w-sm"
        >
          <div className="text-5xl mb-6">📚</div>
          <h2 className="text-3xl font-bold mb-3">Join 4,200+ developers</h2>
          <p className="text-white/80 leading-relaxed">
            Access 127+ in-depth articles, save your favorites, track your
            reading, and join the conversation.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-8 text-sm">
            {[
              "React & TypeScript",
              "AI & Machine Learning",
              "DevOps & Cloud",
              "Career Growth",
            ].map((t) => (
              <div key={t} className="bg-white/15 rounded-xl px-3 py-2.5">
                {t}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
