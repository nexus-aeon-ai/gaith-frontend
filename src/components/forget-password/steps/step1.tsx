import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgetPassword } from "@/lib/api/auth";
import { handleMutationError } from "@/lib/functions/handle-mutation-error";

type Step1Props = {
  onSuccess: (email: string) => void;
};

const forgetPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type TForgetPasswordForm = z.infer<typeof forgetPasswordSchema>;

const Step1: React.FC<Step1Props> = ({ onSuccess }) => {
  const form = useForm<TForgetPasswordForm>({
    resolver: zodResolver(forgetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (data: TForgetPasswordForm) => {
      return forgetPassword(data.email);
    },
    onSuccess: async (response, variables) => {
      if (response?.status && response.status === 201) {
        let message = "Email sent successfully.";
        if (
          typeof response?.data === "object" &&
          response?.data !== null &&
          "message" in response.data
        ) {
          message = String((response.data as { message?: string }).message ?? message);
        }
        toast.success(message);
        onSuccess(variables.email);
      } else {
        throw new Error(JSON.stringify(response?.data));
      }
    },
    onError: (error: Error) => {
      handleMutationError(error, form);
    },
  });

  const handleSubmit = (data: TForgetPasswordForm) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-xl bg-navigation text-card-foreground p-6">
      <CardHeader className="flex flex-col items-center gap-2">
        <CardTitle className="text-2xl font-bold text-center">
          Forgot your password? Recover it.
        </CardTitle>
        <CardDescription className="text-sm text-center">
          Enter the email address associated with your account, and we’ll send you instructions to
          reset your password.
        </CardDescription>
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
            <div className=" mt-10">
              <Button
                type="submit"
                className="w-full bg-[#508CD3] text-white h-13 cursor-pointer"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "Recover Password"
                )}
              </Button>
            </div>
            <div className="mb-2 text-center mt-10 mr-2">
              <Link
                href="/login"
                className="text-xs font-medium text-black dark:text-white hover:underline"
              >
                Sign in
              </Link>
            </div>
            <hr className="border-t border border-gray-300 dark:border-gray-600 my-4" />
            <div className="flex gap-6 justify-center">
              <div className="flex-1 flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-sm text-black dark:text-white bg-transparent px-4 py-2 h-10 rounded-md justify-center">
                <Phone className="w-4 h-4 text-blue-500" />
                <span className="leading-none -mt-0.5">+971 500000000</span>
              </div>
              <div className="flex-1 flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-sm text-black dark:text-white bg-transparent px-4 py-2 h-10 rounded-md justify-center">
                <Mail className="w-4 h-4 text-blue-500" />
                <span className="leading-none -mt-0.5">support@gaith.ae</span>
              </div>
            </div>
            {form.formState.errors.root?.message && (
              <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step1;
