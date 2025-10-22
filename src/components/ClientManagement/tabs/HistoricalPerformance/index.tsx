"use client";

import { ArrowRight, FileSpreadsheet, FileText } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HistoricalPerformanceTabProps } from "@/lib/types";

import {
  mockBudgetData,
  mockFinancialData,
  mockPerformanceData,
  mockSummaryMetrics,
} from "../../data";

const HistoricalPerformanceTab = ({ client }: HistoricalPerformanceTabProps) => {
  const performanceData = mockPerformanceData;
  const budgetData = mockBudgetData;
  const financialData = mockFinancialData;
  const summaryMetrics = mockSummaryMetrics.map(metric => ({
    ...metric,
    icon: metric.icon === "arrow-right" ? <ArrowRight className="h-4 w-4" /> : metric.icon,
  }));

  return (
    <div className="space-y-6 bg-card p-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Historical Performance</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Track success metrics and campaign performance
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Select defaultValue="3-month">
            <SelectTrigger className="w-full sm:w-32 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-month">1 Month</SelectItem>
              <SelectItem value="3-month">3 Month</SelectItem>
              <SelectItem value="6-month">6 Month</SelectItem>
              <SelectItem value="1-year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-1 h-12 border-border bg-card hover:bg-[#3072C014] hover:text-black dark:hover:text-white"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export Excel</span>
              <span className="sm:hidden">Excel</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-none border-1 h-12 border-border bg-card hover:bg-[#3072C014] hover:text-black dark:hover:text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export PDF</span>
              <span className="sm:hidden">PDF</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between p-2">
              <CardTitle>Performance Metrics</CardTitle>
              <Select defaultValue="last-year">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-year">Last year</SelectItem>
                  <SelectItem value="this-year">This year</SelectItem>
                  <SelectItem value="last-6-months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 5, left: 5, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#666" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#666" }}
                    domain={[0, 1000]}
                    ticks={[0, 500, 1000]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fill="transparent"
                    strokeWidth={8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Budget Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between p-2">
              <CardTitle>Budget Overview</CardTitle>
              <Select defaultValue="last-year">
                <SelectTrigger className="w-24 p-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-year">Last year</SelectItem>
                  <SelectItem value="this-year">This year</SelectItem>
                  <SelectItem value="last-6-months">Last 6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <Separator className="mb-4" />
          <CardContent>
            <div className="flex items-center justify-center h-40 sm:h-48">
              <div className="relative">
                <ResponsiveContainer width={140} height={140} className="sm:w-[180px] sm:h-[180px]">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg sm:text-2xl font-bold text-foreground">70%</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Allocated Budget:</span>
                <span className="font-medium">Ɖ 4,000</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Spent To Date:</span>
                <span className="font-medium">Ɖ 2,500</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-muted-foreground">Remaining:</span>
                <span className="font-medium text-green-600">Ɖ 2,500</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between p-2">
            <CardTitle>Financial Summary</CardTitle>
            <Select defaultValue="last-year">
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-year">Last year</SelectItem>
                <SelectItem value="this-year">This year</SelectItem>
                <SelectItem value="last-6-months">Last 6 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialData}
                margin={{ top: 20, right: 10, left: 10, bottom: 10 }}
                barCategoryGap="40%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="quarter"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#666" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#666" }}
                  domain={[0, 100000]}
                  ticks={[0, 50000, 100000]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={35} />
                <Bar dataKey="expenses" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {summaryMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p
                    className={`text-base sm:text-lg font-bold ${
                      metric.isGreen ? "text-green-600" : "text-foreground"
                    }`}
                  >
                    {metric.value}
                  </p>
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
                {metric.icon && <div className="text-muted-foreground ml-2">{metric.icon}</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoricalPerformanceTab;
