"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import FbIcon from "@/components/ui/icons/socials/fb";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const leads = [
  {
    name: "Northwind Traders",
    type: "Retail",
    status: "Completed",
    progress: 20,
    value: "1,250",
  },
  {
    name: "Contoso Ltd",
    type: "Enterprise",
    status: "In Progress",
    progress: 45,
    value: "2,100",
  },
  {
    name: "Fabrikam Inc",
    type: "Manufacturing",
    status: "Pending",
    progress: 75,
    value: "980",
  },
];

export default function LeadReportsTable() {
  return (
    <Card className="rounded-2xl shadow-sm border pt-4 lg:col-span-4 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Client Reports</CardTitle>
        <p className="text-sm text-blue-600 cursor-pointer hover:underline">View All</p>
      </CardHeader>

      <CardContent>
        <Separator className="mb-3 bg-[#eeeeee] dark:bg-gray-700 h-[1px]" />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Client</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.map((client, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-gray-500 dark:text-[#bebebe]">{client.type}</div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <FbIcon />
                    <span className="text-xs text-gray-600 dark:text-[#bebebe]">
                      {client.progress}%
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-[#175E46]/10 text-[#03a46e] font-medium"
                  >
                    {client.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">{client.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
