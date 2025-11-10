import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";

export function handleMutationError<T extends FieldValues>(e: any, form: UseFormReturn<T>) {
  try {
    const errorData = typeof e.message === "string" ? JSON.parse(e.message) : e.response?.data || e;

    if (errorData.detail) {
      toast.error(errorData.detail);
      return;
    }

    if (typeof errorData === "object" && errorData !== null) {
      toast.error("There is an error with your input, please check the fields and try again");
      Object.entries(errorData).forEach(([fieldName, messages]) => {
        const errorMessages = Array.isArray(messages) ? messages : [messages];
        const isNonFieldError = fieldName === "non_field_errors";
        if (isNonFieldError) {
          form.setError("root", {
            type: "manual",
            message: errorMessages.join(", "),
          });
        }
        form.setError(fieldName as Path<T>, {
          type: "manual",
          message: errorMessages.join(", "),
        });
      });
    } else {
      toast.error(e.message || "An unexpected error occurred");
    }
  } catch (parseError) {
    toast.error("An error occurred while processing your request");
    console.error("Error parsing error response:", parseError);
  }
}
