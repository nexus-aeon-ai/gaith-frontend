import { notFound } from "next/navigation";

import ViewEmployee from "@/components/EmployeeManagement/view/ViewEmployee";
import { getEmployeeByIdRaw } from "@/lib/api/employee";

interface EmployeeViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeViewPage({ params }: EmployeeViewPageProps) {
  const { id } = await params;

  try {
    const response = await getEmployeeByIdRaw(id);
    if (!response.data) {
      notFound();
    }
    return <ViewEmployee initialData={response.data} />;
  } catch (error) {
    console.error("Error fetching employee:", error);
    notFound();
  }
}
