import React from "react";

import { FormValues } from "./Campaign";

function StepOverview({ values }: { values: FormValues }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground">Review your information before submitting.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <OverviewItem label="First name" value={values.firstName} />
        <OverviewItem label="Last name" value={values.lastName} />
        <OverviewItem label="Email" value={values.email} />
        <OverviewItem label="Address" value={values.address} />
        <OverviewItem label="City" value={values.city} />
        <OverviewItem label="State" value={values.state} />
        <OverviewItem label="ZIP" value={values.zip} />
        <OverviewItem label="Newsletter" value={values.newsletter ? "Yes" : "No"} />
        <OverviewItem label="Contact method" value={values.contactMethod} />
        {values.contactMethod === "phone" && (
          <OverviewItem label="Phone" value={values.phone || "-"} />
        )}
        <OverviewItem label="Username" value={values.username} />
        <OverviewItem label="Password" value={"•".repeat(values.password.length)} />
      </div>
    </div>
  );
}
export default StepOverview;

function OverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-card p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm">{value || "-"}</div>
    </div>
  );
}
