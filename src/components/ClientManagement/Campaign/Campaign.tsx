"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Stepper } from "@/components/Stepper/Stepper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import StepPersonal from "./Step1";
import StepAddress from "./Step2";
import StepPreferences from "./Step3";
import StepAccount from "./Step4";
import StepOverview from "./Step5";

// Full schema (all steps)
const FormSchema = z
  .object({
    // Step 1: Personal
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Enter a valid email"),
    // Step 2: Address
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z
      .string()
      .min(5, "ZIP must be at least 5 characters")
      .max(10, "ZIP must be at most 10 characters"),
    // Step 3: Preferences
    newsletter: z.boolean(),
    contactMethod: z.enum(["email", "phone"]),
    phone: z.string().optional(),
    // Step 4: Account
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine(
    data => {
      if (data.contactMethod === "phone") {
        return !!data.phone && data.phone.trim().length >= 7;
      }
      return true;
    },
    {
      path: ["phone"],
      message: "Phone is required and must be valid when contact method is Phone",
    },
  );

export type FormValues = z.infer<typeof FormSchema>;

const DEFAULTS: FormValues = {
  firstName: "",
  lastName: "",
  email: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  newsletter: false,
  contactMethod: "email",
  phone: "",
  username: "",
  password: "",
};

const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
  1: ["firstName", "lastName", "email"],
  2: ["address", "city", "state", "zip"],
  3: ["newsletter", "contactMethod", "phone"],
  4: ["username", "password"],
  5: [], // overview only
};

export function CampaignForm() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const isLast = step === totalSteps;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: DEFAULTS,
    mode: "onChange",
  });

  const currentFields = useMemo(() => STEP_FIELDS[step] ?? [], [step]);

  async function handleNext() {
    // validate only the current step's fields
    const valid = await form.trigger(currentFields as (keyof FormValues)[], { shouldFocus: true });
    if (!valid) return;

    if (isLast) {
      // submit on last step
      await form.handleSubmit(onSubmit)();
    } else {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  }

  // function handlePrev() {
  //   setStep(s => Math.max(s - 1, 1));
  // }

  async function handleSave() {
    // Draft save without strict validation
    const values = form.getValues();
    // Simulate a save action
    console.warn("Draft saved:", values);
  }

  function handleCancel() {
    form.reset(DEFAULTS);
    setStep(1);
  }

  async function onSubmit(values: FormValues) {
    // Final submission
    console.warn("Form submitted:", values);
  }

  return (
    <div className="mx-auto w-full p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-balance text-md font-semibold tracking-tight sm:text-2xl">
          Multi-Step Form
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete each step. The final step shows an overview before submission.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg border bg-card p-4 md:p-6"
        >
          <div className="mb-6 rounded-lg bg-card p-4 md:p-6">
            <Stepper
              total={totalSteps}
              current={step}
              labels={["Personal", "Address", "Preferences", "Account", "Overview"]}
            />
          </div>

          {/* Step content */}
          <div className="space-y-4">
            {step === 1 && <StepPersonal form={form} />}
            {step === 2 && <StepAddress form={form} />}
            {step === 3 && <StepPreferences form={form} />}
            {step === 4 && <StepAccount form={form} />}
            {step === 5 && <StepOverview values={form.getValues()} />}
          </div>

          <Separator className="my-6" />

          {/* Footer actions */}
          <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-end w-full gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={handleSave}>
                Save
              </Button>
              <Button type="button" onClick={handleNext}>
                {isLast ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}

/* Step 1: Personal */
// function StepPersonal({ form }: { form }) {
//   const { control } = form.control;
//   return (
//     <div className="grid gap-4 sm:grid-cols-2">
//       <FormField
//         control={control}
//         name="firstName"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>First name</FormLabel>
//             <FormControl>
//               <Input placeholder="Jane" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name="lastName"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Last name</FormLabel>
//             <FormControl>
//               <Input placeholder="Doe" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name="email"
//         render={({ field }) => (
//           <FormItem className="sm:col-span-2">
//             <FormLabel>Email</FormLabel>
//             <FormControl>
//               <Input type="email" placeholder="jane@example.com" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// }

/* Step 2: Address */
// function StepAddress({ form }) {
//   const { control, setValue } = form;
//   return (
//     <div className="grid gap-4 sm:grid-cols-2">
//       <FormField
//         control={control}
//         name="address"
//         render={({ field }) => (
//           <FormItem className="sm:col-span-2">
//             <FormLabel>Address</FormLabel>
//             <FormControl>
//               <Input placeholder="123 Main St" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name="city"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>City</FormLabel>
//             <FormControl>
//               <Input placeholder="Springfield" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name="state"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>State</FormLabel>
//             <FormControl>
//               <Select
//                 value={(field.value as string) || undefined}
//                 onValueChange={v => setValue("state", v, { shouldValidate: true })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a state" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="CA">California</SelectItem>
//                   <SelectItem value="NY">New York</SelectItem>
//                   <SelectItem value="TX">Texas</SelectItem>
//                 </SelectContent>
//               </Select>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name="zip"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>ZIP</FormLabel>
//             <FormControl>
//               <Input placeholder="12345" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// }

/* Step 3: Preferences */
// function StepPreferences({ form }) {
//   const { control, watch, setValue } = form;
//   const contact = watch("contactMethod");
//   return (
//     <div className="grid gap-4 sm:grid-cols-2">
//       <FormField
//         control={control}
//         name="newsletter"
//         render={({ field }) => (
//           <FormItem className="flex flex-row items-center gap-3 rounded-md border p-3 sm:col-span-2">
//             <FormControl>
//               <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//             </FormControl>
//             <div className="space-y-0.5">
//               <FormLabel className="text-base">Subscribe to newsletter</FormLabel>
//               <p className="text-sm text-muted-foreground">
//                 Get updates and tips delivered to your inbox.
//               </p>
//             </div>
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name="contactMethod"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Preferred contact</FormLabel>
//             <FormControl>
//               <Select
//                 value={field.value}
//                 onValueChange={v => setValue("contactMethod", v, { shouldValidate: true })}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select method" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="email">Email</SelectItem>
//                   <SelectItem value="phone">Phone</SelectItem>
//                 </SelectContent>
//               </Select>
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       {contact === "phone" && (
//         <FormField
//           control={control}
//           name="phone"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Phone</FormLabel>
//               <FormControl>
//                 <Input placeholder="(555) 123‑4567" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       )}
//     </div>
//   );
// }

/* Step 4: Account */
// function StepAccount({form}) {
//   const { control } = form.control;
//   return (
//     <div className="grid gap-4 sm:grid-cols-2">
//       <FormField
//         control={control}
//         name="username"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Username</FormLabel>
//             <FormControl>
//               <Input placeholder="janedoe" autoCapitalize="none" autoCorrect="off" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={control}
//         name="password"
//         render={({ field }) => (
//           <FormItem>
//             <FormLabel>Password</FormLabel>
//             <FormControl>
//               <Input type="password" placeholder="••••••••" {...field} />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// }

/* Step 5: Overview */
// function StepOverview({ values }: { values: FormValues }) {
//   return (
//     <div className="space-y-4">
//       <div>
//         <h2 className="text-lg font-semibold">Overview</h2>
//         <p className="text-sm text-muted-foreground">Review your information before submitting.</p>
//       </div>
//       <div className="grid gap-4 sm:grid-cols-2">
//         <OverviewItem label="First name" value={values.firstName} />
//         <OverviewItem label="Last name" value={values.lastName} />
//         <OverviewItem label="Email" value={values.email} />
//         <OverviewItem label="Address" value={values.address} />
//         <OverviewItem label="City" value={values.city} />
//         <OverviewItem label="State" value={values.state} />
//         <OverviewItem label="ZIP" value={values.zip} />
//         <OverviewItem label="Newsletter" value={values.newsletter ? "Yes" : "No"} />
//         <OverviewItem label="Contact method" value={values.contactMethod} />
//         {values.contactMethod === "phone" && (
//           <OverviewItem label="Phone" value={values.phone || "-"} />
//         )}
//         <OverviewItem label="Username" value={values.username} />
//         <OverviewItem label="Password" value={"•".repeat(values.password.length)} />
//       </div>
//     </div>
//   );
// }
