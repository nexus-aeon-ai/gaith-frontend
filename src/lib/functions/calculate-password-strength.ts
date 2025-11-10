import { PasswordStrength } from "@/lib/types";

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) {
    return {
      score: 0,
      label: "Very Weak",
      color: "bg-red-500",
      percentage: 0,
    };
  }

  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  // Require at least 8 characters to get any score
  if (!checks.length) {
    return {
      score: 0,
      label: "Very Weak",
      color: "bg-red-500",
      percentage: 0,
    };
  }

  // Length check - give 1 point for 8+ characters, bonus for 12+
  score += 1;
  if (password.length >= 12) score += 1;

  // Character variety checks
  if (checks.lowercase) score += 1;
  if (checks.uppercase) score += 1;
  if (checks.numbers) score += 1;
  if (checks.symbols) score += 1;
  // Bonus for complexity
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= 8) score += 1;

  // Cap the score at 4
  score = Math.min(score, 4);

  const strengthMap: Record<number, Omit<PasswordStrength, "score" | "percentage">> = {
    0: { label: "Very Weak", color: "bg-red-500" },
    1: { label: "Weak", color: "bg-orange-500" },
    2: { label: "Fair", color: "bg-yellow-500" },
    3: { label: "Good", color: "bg-blue-500" },
    4: { label: "Strong", color: "bg-green-500" },
  };

  return {
    score,
    ...strengthMap[score],
    percentage: (score / 4) * 100,
  };
};
