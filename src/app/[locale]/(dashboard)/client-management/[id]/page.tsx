import { notFound } from "next/navigation";

import ViewClient from "@/components/ClientManagement/ViewClient";
import { getClientById } from "@/lib/api/client/client";

interface ClientViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientViewPage({ params }: ClientViewPageProps) {
  const { id } = await params;

  try {
    const client = await getClientById(id);
    return <ViewClient initialData={client} />;
  } catch (error) {
    console.error("Error fetching client:", error);
    notFound();
  }
}

