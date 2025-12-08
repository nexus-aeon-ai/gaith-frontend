import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { forgetPassword, verifyOtp } from "@/lib/api/auth";
import { handleMutationError } from "@/lib/functions/handle-mutation-error";

const RESEND_INTERVAL = 60;

type Step2Props = {
  email: string;
  onSuccess: (otp: string) => void;
};

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});
type TOtpForm = z.infer<typeof otpSchema>;

const Step2: React.FC<Step2Props> = ({ email, onSuccess }) => {
  const [timer, setTimer] = useState(RESEND_INTERVAL);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const form = useForm<TOtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const mutation = useMutation({
    mutationFn: async (data: TOtpForm) => verifyOtp(email, data.otp),
    onSuccess: (response, variables) => {
      if (response.status === 201) {
        let message = "OTP verified successfully. Proceed to reset your password.";
        if (
          typeof response?.data === "object" &&
          response?.data !== null &&
          "message" in response.data
        ) {
          message = String((response.data as { message?: string }).message ?? message);
        }
        toast.success(message);
        onSuccess(variables.otp);
      } else {
        toast.error("Invalid or expired code. Please try again.");
      }
    },
    onError: (error: Error) => {
      handleMutationError(error, form);
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: async () => forgetPassword(email),
    onSuccess: response => {
      if (response.status === 200 || response.status === 201) {
        let message = "A new OTP has been sent to your email.";
        if (
          typeof response?.data === "object" &&
          response?.data !== null &&
          "message" in response.data
        ) {
          message = String((response.data as { message?: string }).message ?? message);
        }
        toast.success(message);
        setTimer(RESEND_INTERVAL);
      } else {
        const errorData = JSON.stringify(response.data);
        toast.error(errorData);
      }
    },
    onError: (error: Error) => {
      handleMutationError(error, form);
    },
  });

  const handleResend = () => {
    resendMutation.mutate();
  };

  const handleSubmit = (data: TOtpForm) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-xl bg-navigation text-card-foreground p-6">
      <CardHeader className="flex flex-col items-center gap-2">
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-sm text-center">
          We’ve sent a One-Time Password (OTP) to your email:{" "}
          <span className="font-semibold">{email}</span>
          <br />
          Please enter the code below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 pb-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                      pattern={REGEXP_ONLY_DIGITS}
                      containerClassName="justify-center "
                    >
                      <InputOTPGroup className="[&>div]:w-12 [&>div]:h-12 [&>div]:rounded-lg [&>div]:border-2 [&>div]:border-gray-700 [&>div]:text-2xl [&>div]:font-semibold [&>div]:text-center [&>div]:bg-white dark:[&>div]:bg-gray-900 [&>div]:transition-all [&>div]:focus:border-blue-500 [&>div]:focus:ring-2 [&>div]:focus:ring-blue-200 gap-2">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div
              className="mb-2 text-center mt-10 mr-2  text-[#2BAE82] hover:underline cursor-pointer"
              onClick={handleResend}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && handleResend()}
            >
              Don&apos;t receive a code?
            </div>
            <div className="mt-2">
              <Button
                type="submit"
                className="w-full bg-[#508CD3] text-white h-13 cursor-pointer"
                disabled={
                  mutation.isPending ||
                  resendMutation.isPending ||
                  (timer > 0 && form.getValues("otp").length !== 6)
                }
              >
                {mutation.isPending
                  ? "Verifying..."
                  : resendMutation.isPending
                    ? "Resending..."
                    : form.getValues("otp").length === 6
                      ? "Verify Code"
                      : timer > 0
                        ? `Resend in ${timer}s`
                        : "Resend OTP"}
              </Button>
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

export default Step2;
