"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import RightArrow from "@/components/ui/icons/right-arrow";
import FbIcon from "@/components/ui/icons/socials/fb";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const leads = [
  {
    name: "Northwind Traders",
    type: "Retail",
    status: "Completed",
    source: "Facebook",
    progress: 20,
    value: "1,250",
  },
  {
    name: "Contoso Ltd",
    type: "Enterprise",
    status: "In Progress",
    source: "Facebook",
    progress: 45,
    value: "2,100",
  },
  {
    name: "Fabrikam Inc",
    type: "Manufacturing",
    status: "Pending",
    source: "Facebook",
    progress: 75,
    value: "980",
  },
];

export default function LeadReportsTable() {
  return (
    <Card className="rounded-2xl shadow-sm border pt-4 lg:col-span-4 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Lead Reports</CardTitle>
        <div className="flex items-center gap-1">
          <a href="#none" className="text-md font-medium text-[#3072C0]">
            View All
          </a>
          <RightArrow size={16} className="text-[#3072C0] " />
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="mb-3 bg-[#eeeeee] dark:bg-gray-700 h-[1px]" />

        <Table>
          <TableHeader>
            <TableRow className="dark:border-[#404663]">
              <TableHead className="w-[200px]">Leads</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {leads.map((client, idx) => (
              <TableRow key={idx} className="dark:border-[#404663]">
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-gray-500 dark:text-[#bebebe]">{client.type}</div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <FbIcon />
                    <span className="text-sm text-[#303444] dark:text-[#bebebe]">
                      {client.source}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary" className="bg-[#175E46]/10 text-[#03a46e] font-medium">
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
