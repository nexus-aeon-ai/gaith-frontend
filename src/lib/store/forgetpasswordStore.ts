import { create } from "zustand";

interface ForgetPasswordState {
  email: string;
  otp: string;
  step: number;
  showSuccess: boolean;
  setEmail: (email: string) => void;
  setOtp: (otp: string) => void;
  setStep: (step: number) => void;
  setShowSuccess: (show: boolean) => void;
  reset: () => void;
}

export const useForgetPasswordStore = create<ForgetPasswordState>(set => ({
  email: "",
  otp: "",
  step: 1,
  showSuccess: false,
  setEmail: email => set({ email }),
  setOtp: otp => set({ otp }),
  setStep: step => set({ step }),
  setShowSuccess: showSuccess => set({ showSuccess }),
  reset: () => set({ email: "", otp: "", step: 1, showSuccess: false }),
}));
