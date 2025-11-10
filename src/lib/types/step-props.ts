import { UseFormReturn } from "react-hook-form";

import { FormValues } from "@/components/ClientManagement/Campaign/Campaign";

export type StepFormProps = {
  form: UseFormReturn<FormValues>;
};
