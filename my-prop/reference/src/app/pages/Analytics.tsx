import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  ChevronDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "../components/ui/dropdown-menu";
import { useState } from "react";

const leadsOverTimeData = [
  { date: "Jan", leads: 145, qualified: 89, converted: 23 },
  { date: "Feb", leads: 178, qualified: 102, converted: 31 },
  { date: "Mar", leads: 203, qualified: 125, converted: 38 },
  { date: "Apr", leads: 189, qualified: 118, converted: 42 },
  { date: "May", leads: 234, qualified: 156, converted: 51 },
  { date: "Jun", leads: 267, qualified: 178, converted: 58 },
];

const sourceData = [
  { name: "Website", value: 45, color: "#10b981" },
  { name: "WhatsApp", value: 30, color: "#14b8a6" },
  { name: "Social Media", value: 15, color: "#f59e0b" },
  { name: "Referral", value: 10, color: "#6366f1" },
];

const campaignPerformance = [
  { name: "Skyline Launch", sent: 1245, converted: 45, cpl: 280 },
  { name: "Green Valley", sent: 3456, converted: 28, cpl: 420 },
  { name: "Marina Bay", sent: 567, converted: 32, cpl: 195 },
  { name: "Weekend Visit", sent: 892, converted: 18, cpl: 510 },
];

const conversionFunnel = [
  { stage: "Visitors", count: 12450, percentage: 100 },
  { stage: "Leads", count: 4285, percentage: 34.4 },
  { stage: "Qualified", count: 1856, percentage: 43.3 },
  { stage: "Site Visits", count: 982, percentage: 52.9 },
  { stage: "Closed", count: 425, percentage: 43.3 },
];

export function Analytics() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-600 mt-1">Track performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                {timeRange}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTimeRange("Last 30 Days")}>
                Last 30 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("Last 60 Days")}>
                Last 60 Days
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTimeRange("Last 90 Days")}>
                Last 90 Days
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTimeRange("Custom Range")}>
                Custom Range
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
            <Users className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">4,285</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">18.2%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">9.92%</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">2.4%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Cost Per Lead</CardTitle>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">₹325</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">12.5%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Website Visitors</CardTitle>
            <Eye className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">12,450</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">24.8%</span>
              <span className="text-slate-500">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads & Conversions Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={leadsOverTimeData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorConverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorLeads)"
                  name="Total Leads"
                />
                <Area 
                  type="monotone" 
                  dataKey="qualified" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorQualified)"
                  name="Qualified"
                />
                <Area 
                  type="monotone" 
                  dataKey="converted" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorConverted)"
                  name="Converted"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {sourceData.map((source) => (
                <div key={source.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }}></div>
                    <span className="text-sm text-slate-700">{source.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Performance & Funnel */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Legend />
                <Bar dataKey="sent" fill="#cbd5e1" radius={[8, 8, 0, 0]} name="Messages Sent" />
                <Bar dataKey="converted" fill="#10b981" radius={[8, 8, 0, 0]} name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-3">
              {campaignPerformance.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{campaign.name}</p>
                    <p className="text-sm text-slate-500">
                      {campaign.converted} conversions from {campaign.sent} sent
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-900">₹{campaign.cpl}</p>
                    <p className="text-xs text-slate-500">CPL</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => {
                const width = stage.percentage;
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">{stage.stage}</span>
                      <div className="text-right">
                        <span className="text-lg font-bold text-slate-900">{stage.count.toLocaleString()}</span>
                        {index > 0 && (
                          <span className="text-sm text-slate-500 ml-2">({stage.percentage}%)</span>
                        )}
                      </div>
                    </div>
                    <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center transition-all"
                        style={{ width: `${width}%` }}
                      >
                        <span className="text-white font-medium text-sm">
                          {stage.percentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Overall Conversion Rate</p>
                  <p className="text-2xl font-bold text-emerald-700">3.41%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-600 opacity-30" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Websites */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Websites</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "Skyline Heights", visitors: 4285, leads: 234, conversion: "5.46%", revenue: "₹2.1Cr" },
              { name: "Marina Bay Apartments", visitors: 3567, leads: 189, conversion: "5.30%", revenue: "₹1.8Cr" },
              { name: "Green Valley Villas", visitors: 2890, leads: 156, conversion: "5.40%", revenue: "₹1.5Cr" },
            ].map((website, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg hover:border-emerald-300 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{website.name}</h3>
                    <p className="text-sm text-slate-600">{website.visitors.toLocaleString()} visitors</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{website.leads}</p>
                    <p className="text-xs text-slate-500">Leads</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-teal-600">{website.conversion}</p>
                    <p className="text-xs text-slate-500">CVR</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{website.revenue}</p>
                    <p className="text-xs text-slate-500">Revenue</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}