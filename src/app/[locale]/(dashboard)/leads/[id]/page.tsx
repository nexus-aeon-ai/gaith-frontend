import { notFound } from "next/navigation";

import ViewLead from "@/components/LeadManagement/ViewLead";
import { getLeadById } from "@/lib/api/leads";

interface LeadViewPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadViewPage({ params }: LeadViewPageProps) {
  const { id } = await params;

  try {
    const lead = await getLeadById(id);
    return <ViewLead initialData={lead} />;
  } catch (error) {
    console.error("Error fetching lead:", error);
    notFound();
  }
}

