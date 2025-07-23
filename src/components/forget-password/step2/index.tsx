import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { forgetPassword, verifyOtp } from "@/lib/api/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

const RESEND_INTERVAL = 60;

type Step2Props = {
  email: string;
  onSuccess: (otp: string) => void;
  onBack: () => void;
};

const Step2: React.FC<Step2Props> = ({ email, onSuccess, onBack }) => {
  const [otpValue, setOtpValue] = useState("");
  const [timer, setTimer] = useState(RESEND_INTERVAL);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const mutation = useMutation({
    mutationFn: async (otp: string) => verifyOtp(email, otp),
    onSuccess: (response, otp) => {
      if (response.status === 201) {
        let message = "OTP verified successfully. Proceed to reset your password.";
        if (typeof response?.data === "object" && response?.data !== null && "message" in response.data) {
          message = String((response.data as { message?: string }).message ?? message);
        }
        toast.success(message);
      
        onSuccess(otp);
      } else {
        toast.error("Invalid or expired code. Please try again.");
      }
    },
    onError: (error: unknown) => {
      let message = "Invalid or expired code. Please try again.";
      if (error && typeof error === "object" && "message" in error && typeof (error as { message?: string }).message === "string") {
        try {
          const errorData = JSON.parse((error as { message: string }).message);
          if (errorData?.message) message = errorData.message;
        } catch {}
      }
      toast.error(message);
    },
  });

  // Resend OTP mutation
  const resendMutation = useMutation({
    mutationFn: async () => forgetPassword(email),
    onSuccess: (response) => {
      if (response.status === 200 || response.status === 201) {
        let message = "A new OTP has been sent to your email.";
        if (typeof response?.data === "object" && response?.data !== null && "message" in response.data) {
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
      const errorData = JSON.parse(error.message);
      toast.error(errorData.message);
    },
  });

  const handleResend = () => {
    resendMutation.mutate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(otpValue);
  };
//  || otpValue.length != 6 || timer > 0
  return (
    <Card className="w-full shadow-xl bg-card text-card-foreground p-6">
      <CardHeader className="flex flex-col items-center gap-2">
        <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
        <CardDescription className="text-sm text-center">
          We’ve sent a One-Time Password (OTP) to your email: <span className="font-semibold">{email}</span><br />
          Please enter the code below to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 pb-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <InputOTP
              maxLength={6}
              value={otpValue}
              onChange={setOtpValue}
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
          </div>
          <div className="mb-2 text-center mt-10 mr-2">
            <Button type="button" variant="link" className="text-xs font-medium text-[#2BAE82] hover:underline" onClick={onBack} disabled={mutation.isPending}>
              Don&apos;t receive a code?
            </Button>
          </div>
          <div className="mt-2">
            <Button 
              type="button" 
              className="w-full bg-[#508CD3] text-white h-13" 
              disabled={mutation.isPending || resendMutation.isPending ||( otpValue.length != 6 && timer > 0)}   
              onClick={otpValue.length === 6 ? handleSubmit : handleResend}
            >
              {mutation.isPending ? "Verifying..." : 
               resendMutation.isPending ? "Resending..." : 
               otpValue.length === 6 ? "Verify Code" :
               timer > 0 ? `Resend in ${timer}s` : 
               "Resend OTP"}
            </Button>
          </div>
     
          {mutation.isError && (
            <p className="text-sm text-red-500">
              {mutation.error instanceof Error ? mutation.error.message : "An error occurred."}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default Step2; 