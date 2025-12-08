import { notFound } from "next/navigation";

import EditLeadPage from "@/components/LeadManagement/EditLeadPage";
import { getLeadById } from "@/lib/api/leads";

interface LeadEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadEditPage({ params }: LeadEditPageProps) {
  const { id } = await params;

  try {
    const lead = await getLeadById(id);
    return <EditLeadPage initialData={lead} leadId={id} />;
  } catch (error) {
    console.error("Error fetching lead:", error);
    notFound();
  }
}

