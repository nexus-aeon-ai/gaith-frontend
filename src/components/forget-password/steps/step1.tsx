import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight, Loader2, Mail, Phone } from "lucide-react";
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
    <Card className="w-full py-8 shadow-none bg-card rounded-[24px] text-card-foreground p-6">
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
            <div className="mt-10">
              <Button
                type="submit"
                className="w-full border-none text-white p-4 px-6 h-12 text-md font-[400] bg-[#3072C0] hover:bg-[#3072C0]/80 rounded-[16px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  "Recover Password"
                )}
                <ChevronRight />
              </Button>
            </div>
            <div className="mb-2 text-center mt-6 mr-2">
              <Link
                href="/login"
                className="text-sm font-medium text-black dark:text-white hover:underline"
              >
                Sign in
              </Link>
            </div>
            <hr className="border-t border border-gray-300 dark:border-gray-600 my-4" />
            <div className="flex items-center justify-evenly  ">
              <div className="flex items-center  gap-2 rounded-[12px] border px-4 py-2">
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.1834 8.95866C14.825 8.95866 14.5417 8.66699 14.5417 8.31699C14.5417 8.00866 14.2334 7.36699 13.7167 6.80866C13.2084 6.26699 12.65 5.95033 12.1834 5.95033C11.825 5.95033 11.5417 5.65866 11.5417 5.30866C11.5417 4.95866 11.8334 4.66699 12.1834 4.66699C13.0167 4.66699 13.8917 5.11699 14.6584 5.92533C15.375 6.68366 15.8334 7.62533 15.8334 8.30866C15.8334 8.66699 15.5417 8.95866 15.1834 8.95866Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M18.1917 8.95866C17.8333 8.95866 17.55 8.66699 17.55 8.31699C17.55 5.35866 15.1417 2.95866 12.1917 2.95866C11.8333 2.95866 11.55 2.66699 11.55 2.31699C11.55 1.96699 11.8333 1.66699 12.1833 1.66699C15.85 1.66699 18.8333 4.65033 18.8333 8.31699C18.8333 8.66699 18.5417 8.95866 18.1917 8.95866Z"
                    fill="#3072C0"
                  />
                  <path
                    opacity="0.4"
                    d="M10.325 11.842L7.60002 14.567C7.30002 14.3003 7.00835 14.0253 6.72502 13.742C5.86669 12.8753 5.09169 11.967 4.40002 11.017C3.71669 10.067 3.16669 9.11699 2.76669 8.17533C2.36669 7.22533 2.16669 6.31699 2.16669 5.45033C2.16669 4.88366 2.26669 4.34199 2.46669 3.84199C2.66669 3.33366 2.98335 2.86699 3.42502 2.45033C3.95835 1.92533 4.54169 1.66699 5.15835 1.66699C5.39169 1.66699 5.62502 1.71699 5.83335 1.81699C6.05002 1.91699 6.24169 2.06699 6.39169 2.28366L8.32502 5.00866C8.47502 5.21699 8.58335 5.40866 8.65835 5.59199C8.73335 5.76699 8.77502 5.94199 8.77502 6.10033C8.77502 6.30033 8.71669 6.50033 8.60002 6.69199C8.49169 6.88366 8.33335 7.08366 8.13335 7.28366L7.50002 7.94199C7.40835 8.03366 7.36669 8.14199 7.36669 8.27533C7.36669 8.34199 7.37502 8.40033 7.39169 8.46699C7.41669 8.53366 7.44169 8.58366 7.45835 8.63366C7.60835 8.90866 7.86669 9.26699 8.23335 9.70033C8.60835 10.1337 9.00835 10.5753 9.44169 11.017C9.74169 11.3087 10.0334 11.592 10.325 11.842Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M18.808 15.2752C18.808 15.5085 18.7664 15.7502 18.683 15.9835C18.658 16.0502 18.633 16.1169 18.5997 16.1835C18.458 16.4835 18.2747 16.7669 18.033 17.0335C17.6247 17.4835 17.1747 17.8085 16.6664 18.0169C16.658 18.0169 16.6497 18.0252 16.6414 18.0252C16.1497 18.2252 15.6164 18.3335 15.0414 18.3335C14.1914 18.3335 13.283 18.1335 12.3247 17.7252C11.3664 17.3169 10.408 16.7669 9.45803 16.0752C9.13303 15.8335 8.80803 15.5919 8.49969 15.3335L11.2247 12.6085C11.458 12.7835 11.6664 12.9169 11.8414 13.0085C11.883 13.0252 11.933 13.0502 11.9914 13.0752C12.058 13.1002 12.1247 13.1085 12.1997 13.1085C12.3414 13.1085 12.4497 13.0585 12.5414 12.9669L13.1747 12.3419C13.383 12.1335 13.583 11.9752 13.7747 11.8752C13.9664 11.7585 14.158 11.7002 14.3664 11.7002C14.5247 11.7002 14.6914 11.7335 14.8747 11.8085C15.058 11.8835 15.2497 11.9919 15.458 12.1335L18.2164 14.0919C18.433 14.2419 18.583 14.4169 18.6747 14.6252C18.758 14.8335 18.808 15.0419 18.808 15.2752Z"
                    fill="#3072C0"
                  />
                </svg>

                <p>+971 00000000</p>
              </div>
              <div className="flex items-center  gap-2 rounded-[12px] border px-4 py-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.4"
                    d="M14.1666 17.0837H5.83329C3.33329 17.0837 1.66663 15.8337 1.66663 12.917V7.08366C1.66663 4.16699 3.33329 2.91699 5.83329 2.91699H14.1666C16.6666 2.91699 18.3333 4.16699 18.3333 7.08366V12.917C18.3333 15.8337 16.6666 17.0837 14.1666 17.0837Z"
                    fill="#3072C0"
                  />
                  <path
                    d="M9.99998 10.725C9.29998 10.725 8.59165 10.5083 8.04998 10.0666L5.44164 7.98331C5.17498 7.76664 5.12498 7.37497 5.34165 7.10831C5.55831 6.84164 5.94998 6.79164 6.21665 7.00831L8.82497 9.09165C9.45831 9.59998 10.5333 9.59998 11.1666 9.09165L13.775 7.00831C14.0416 6.79164 14.4416 6.83331 14.65 7.10831C14.8666 7.37497 14.825 7.77498 14.55 7.98331L11.9416 10.0666C11.4083 10.5083 10.7 10.725 9.99998 10.725Z"
                    fill="#3072C0"
                  />
                </svg>

                <p>support@gaith.ae</p>
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
