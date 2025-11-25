import { notFound } from "next/navigation";

import EditEmployee from "@/components/EmployeeManagement/edit/EditEmployee";
import { getEmployeeByIdRaw } from "@/lib/api/employee";

interface EmployeeEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeEditPage({ params }: EmployeeEditPageProps) {
  const { id } = await params;

  try {
    const response = await getEmployeeByIdRaw(id);
    if (!response.data) {
      notFound();
    }
    return <EditEmployee employeeId={id} initialData={response.data} />;
  } catch (error) {
    console.error("Error fetching employee:", error);
    notFound();
  }
}

