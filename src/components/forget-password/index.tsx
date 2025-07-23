
"use client";
import React, { useState } from "react";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Success from "./Success";

export default function ForgetPassword() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);


    return (
        showSuccess ? (
            <Success />
        ) : (
            <>
                {step === 1 && <Step1 onSuccess={(emailValue) => {
                    setEmail(emailValue);
                    setStep(2);
                }} />}
                {step === 2 && <Step2 email={email} onSuccess={(otpValue) => {
                    setOtp(otpValue);
                    setStep(3);
                }} onBack={() => setStep(1)} />}
                {step === 3 && <Step3 email={email} otp={otp} onSuccess={() => {
                    setShowSuccess(true);
                }} onBack={() => setStep(2)} />}
            </>
        )
    )
}