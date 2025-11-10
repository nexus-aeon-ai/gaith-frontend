import EditEmployee from "@/components/EmployeeManagement/EditEmployee";

type PageProps = {
  params: { id: string };
};

export default function EmployeeEditPage({ params }: PageProps) {
  return <EditEmployee employeeId={params.id} />;
}

