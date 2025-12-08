import { notFound } from "next/navigation";

import EditClientPage from "@/components/ClientManagement/EditClientPage";
import { getClientById } from "@/lib/api/client/client";

interface ClientEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientEditPage({ params }: ClientEditPageProps) {
  const { id } = await params;

  try {
    const client = await getClientById(id);
    return <EditClientPage initialData={client} clientId={id} />;
  } catch (error) {
    console.error("Error fetching client:", error);
    notFound();
  }
}

