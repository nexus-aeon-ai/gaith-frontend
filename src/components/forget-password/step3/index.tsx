import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { resetPassword } from "@/lib/api/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type TPasswordForm = z.infer<typeof passwordSchema>;

type Step3Props = {
  email: string;
  otp: string;
  onSuccess: () => void;
};

const Step3: React.FC<Step3Props> = ({ email, otp, onSuccess }) => {
  const form = useForm<TPasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: TPasswordForm) => resetPassword(email, otp, data.password, data.confirmPassword),
    onSuccess: (response) => {
      if (response.status === 201) {
        let message = "Password reset successfully.";
        if (typeof response?.data === "object" && response?.data !== null && "message" in response.data) {
          message = String((response.data as { message?: string }).message ?? message);
        }
        toast.success(message);
        onSuccess();
      } else {
        let message = "Failed to reset password. Please try again.";
        if (typeof response?.data === "object" && response?.data !== null && "message" in response.data) {
          message = String((response.data as { message?: string }).message ?? message);
        }
        toast.error(message);
      }
    },
    onError: (error: Error) => {
      console.log(error);

      const errorData = JSON.parse(error.message);
      toast.error(errorData.message);
    },
  });


  const handleSubmit = (data: TPasswordForm) => {
    mutation.mutate(data);
  };

  return (
    <Card className="w-full shadow-xl bg-card text-card-foreground p-6">
      <CardHeader className="flex flex-col items-center gap-2">
        <CardTitle className="text-2xl font-bold text-center">Add new password</CardTitle>
        <CardDescription className="text-sm text-center">Create a strong new password for your account to continue securely.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-6 pb-0 mt-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Enter new password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password <span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <PasswordInput 
                      placeholder="Confirm new password" 
                      showStrengthIndicator={false}
                      enableGeneratePassword={false}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-[#508CD3] text-white h-13 mt-12" disabled={mutation.isPending}>
              {mutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Change Password"}
            </Button>
      
            {mutation.isError && <p className="text-sm text-red-500">Failed to reset password. Please try again.</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default Step3; 