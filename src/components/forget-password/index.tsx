"use client";
import React from "react";

import { useForgetPasswordStore } from "@/lib/store/forgetpasswordStore";

import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Success from "./steps/success";

export default function ForgetPassword() {
  const { email, otp, setEmail, setOtp, step, setStep, showSuccess, setShowSuccess } =
    useForgetPasswordStore();

  return showSuccess ? (
    <Success />
  ) : (
    <>
      {step === 1 && (
        <Step1
          onSuccess={emailValue => {
            setEmail(emailValue);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <Step2
          email={email}
          onSuccess={otpValue => {
            setOtp(otpValue);
            setStep(3);
          }}
        />
      )}
      {step === 3 && (
        <Step3
          email={email}
          otp={otp}
          onSuccess={() => {
            setShowSuccess(true);
          }}
        />
      )}
    </>
  );
}
