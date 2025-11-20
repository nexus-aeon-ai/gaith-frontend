"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import DownloadFileIcon from "@/components/ui/icons/download-file";
import EyeIcon from "@/components/ui/icons/eye";
import RightArrow from "@/components/ui/icons/right-arrow";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const clients = [
  {
    name: "Northwind Traders",
    type: "Retail",
    status: "Completed",
    progress: 20,
  },
  {
    name: "Contoso Ltd",
    type: "Enterprise",
    status: "In Progress",
    progress: 45,
  },
  {
    name: "Fabrikam Inc",
    type: "Manufacturing",
    status: "Pending",
    progress: 75,
  },
];

export default function ClientReportsTable() {
  return (
    <Card className="rounded-2xl shadow-sm border pt-4 lg:col-span-6 col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Client Reports</CardTitle>
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
              <TableHead className="dark:text-[#CCCFDB] text-[#303444]">Client</TableHead>
              <TableHead className="dark:text-[#CCCFDB] text-[#303444]">Status</TableHead>
              <TableHead className="dark:text-[#CCCFDB] text-[#303444]">Progress</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {clients.map((client, idx) => (
              <TableRow key={idx} className="text-sm dark:border-[#404663]">
                {/* Client */}
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-xs text-gray-500 dark:text-[#bebebe]">{client.type}</div>
                </TableCell>

                {/* Status */}
                <TableCell>
                  <Badge variant="secondary" className="bg-[#175E46]/10 text-[#03a46e] font-medium">
                    {client.status}
                  </Badge>
                </TableCell>

                {/* Progress */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={client.progress}
                      className="w-24 h-2 rounded-full overflow-hidden"
                      color="#508CD3"
                    />
                    <span className="text-xs text-gray-600 dark:text-[#bebebe]">
                      {client.progress}%
                    </span>
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" className="bg-transparent">
                      <EyeIcon className="!h-6 !w-6 " color="#508CD3" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <DownloadFileIcon color="#2BAE82" className="!h-5 !w-5" viewBox="0 0 20 20" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
