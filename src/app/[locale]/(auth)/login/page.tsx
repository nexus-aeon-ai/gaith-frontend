"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { Loader2, Mail, Lock } from "lucide-react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormValues) => {
      // Replace with your real API call
      await new Promise((res) => setTimeout(res, 1000));
      if (data.email !== "test@example.com" || data.password !== "password123") {
        throw new Error("Invalid credentials");
      }
      return { success: true };
    },
    onError: (error: Error) => {
      form.setError("email", { message: error.message });
      form.setError("password", { message: error.message });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <Card className="w-full shadow-xl bg-card text-card-foreground p-6">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-background shadow">
          <Image src="/images/logo.svg" alt="Logo" className="w-12 h-12" width={48} height={48} />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="w-4 h-4" />
            </span>
            <Input
              type="email"
              placeholder="Email"
              {...form.register("email")}
              autoComplete="email"
              className={`pl-10 ${form.formState.errors.email ? "border-destructive" : ""}`}
            />
            {form.formState.errors.email && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="w-4 h-4" />
            </span>
            <Input
              type="password"
              placeholder="Password"
              {...form.register("password")}
              autoComplete="current-password"
              className={`pl-10 ${form.formState.errors.password ? "border-destructive" : ""}`}
            />
            {form.formState.errors.password && (
              <p className="text-destructive text-xs mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loginMutation.status === 'pending'}>
            {loginMutation.status === 'pending' ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            Sign In
          </Button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-muted" />
          <span className="mx-2 text-muted-foreground text-xs">or</span>
          <div className="flex-1 h-px bg-muted" />
        </div>
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 bg-card"
          type="button"
          onClick={() => signIn("google")}
        >
            <FcGoogle className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
