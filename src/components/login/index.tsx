"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { login } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/authStore";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  organizationId: z.string().min(1, "Organization ID is required"),
  password: z.string().min(1, "Password is required"),
});

type TLoginForm = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const form = useForm<TLoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      organizationId: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: TLoginForm) => {
      return login(data.email, data.password, data.organizationId);
    },
    onSuccess: async response => {
      if (response?.status && response.status === 200) {
        console.log("login response:", response);
        if (response.data?.access_token) {
          setCookie("authToken", response.data.access_token, {
            secure: false,
            maxAge: 60 * 60 * 24 * 365,
            path: "/",
          });
        }
        if (response.data?.user) {
          setUser(response.data.user);
        }
        toast.success("Login successful!");
        router.push("/");
      } else {
        throw new Error(JSON.stringify(response?.data));
      }
    },
    onError: (error: Error) => {
      const errorData = JSON.parse(error.message);
      toast.error(errorData.message);
    },
  });

  const handleSubmit = (data: TLoginForm) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-xl bg-navigation text-card-foreground p-6">
      <CardHeader className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-background shadow">
          <Image src="/images/logo.svg" alt="Logo" className="w-12 h-12" width={48} height={48} />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Welcome Back!</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter your email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Organization ID <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Organization ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password"
                      {...field}
                      enableGeneratePassword={false}
                      showStrengthIndicator={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mb-2 ">
              <Link
                href="/forget-password"
                className="text-xs font-medium text-[#5B17FF] hover:underline"
              >
                Forget Password ?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Sign In"}
            </Button>
            {form.formState.errors.root?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}
          </form>
        </Form>
      </CardContent>
      <div className="flex justify-between items-center px-6 pb-6 mt-4">
        <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-2">
          <span className="text-primary">📞</span>
          <span className="text-sm font-medium">+971 500000000</span>
        </div>
        <div className="flex items-center gap-2 border border-border rounded-lg px-4 py-2">
          <span className="text-primary">✉️</span>
          <span className="text-sm font-medium">support@gaith.ae</span>
        </div>
      </div>
    </Card>
  );
}
