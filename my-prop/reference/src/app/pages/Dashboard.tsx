import { 
  Users, 
  TrendingUp, 
  Send, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Globe,
  MessageSquare,
  UserPlus
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { CreateWebsiteWizard } from "../components/CreateWebsiteWizard";
import { AddLeadDialog } from "../components/AddLeadDialog";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

const leadsData = [
  { name: "Mon", leads: 45 },
  { name: "Tue", leads: 52 },
  { name: "Wed", leads: 48 },
  { name: "Thu", leads: 65 },
  { name: "Fri", leads: 58 },
  { name: "Sat", leads: 72 },
  { name: "Sun", leads: 55 },
];

const sourceData = [
  { name: "Website", value: 45, color: "#10b981" },
  { name: "WhatsApp", value: 30, color: "#14b8a6" },
  { name: "Social Media", value: 15, color: "#f59e0b" },
  { name: "Referral", value: 10, color: "#6366f1" },
];

const funnelData = [
  { stage: "Visitors", count: 1250 },
  { stage: "Leads", count: 425 },
  { stage: "Qualified", count: 185 },
  { stage: "Meetings", count: 98 },
  { stage: "Closed", count: 42 },
];

const recentLeads = [
  { name: "Rahul Sharma", phone: "+91 98765 43210", budget: "₹80L - 1Cr", source: "Website", status: "new" },
  { name: "Priya Patel", phone: "+91 98765 43211", budget: "₹1.2Cr - 1.5Cr", source: "WhatsApp", status: "contacted" },
  { name: "Amit Kumar", phone: "+91 98765 43212", budget: "₹60L - 80L", source: "Social", status: "interested" },
  { name: "Neha Singh", phone: "+91 98765 43213", budget: "₹2Cr+", source: "Referral", status: "scheduled" },
];

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's what's happening with your properties.</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700" onClick={() => setOpen(true)}>
          Create New Website
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Leads</CardTitle>
            <Users className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">2,847</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">12.5%</span>
              <span className="text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-teal-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Today's Leads</CardTitle>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">48</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUpRight className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">8.2%</span>
              <span className="text-slate-500">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Active Campaigns</CardTitle>
            <Send className="w-4 h-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">12</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <span className="text-slate-600">3 launching today</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Conversion Rate</CardTitle>
            <DollarSign className="w-4 h-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">24.8%</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowDownRight className="w-4 h-4 text-rose-600" />
              <span className="text-rose-600 font-medium">2.1%</span>
              <span className="text-slate-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads Over Time */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={leadsData}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
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
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
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
          </CardContent>
        </Card>
      </div>

      {/* Funnel & Recent Leads */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={funnelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="stage" type="category" stroke="#64748b" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setAddLeadOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-1" />
                  Add Lead
                </Button>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-700">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{lead.name}</p>
                        <p className="text-sm text-slate-500">{lead.phone}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right mr-6">
                    <p className="text-sm font-medium text-slate-900">{lead.budget}</p>
                    <p className="text-xs text-slate-500">Budget</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lead.source === 'Website' ? 'bg-emerald-100 text-emerald-700' :
                      lead.source === 'WhatsApp' ? 'bg-teal-100 text-teal-700' :
                      lead.source === 'Social' ? 'bg-amber-100 text-amber-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {lead.source}
                    </div>
                    <Button variant="ghost" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Websites */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Websites</CardTitle>
            <Button variant="outline" size="sm">Manage All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Skyline Heights", domain: "skyline-heights.myprop.live", leads: 234, views: 1245 },
              { name: "Green Valley Villas", domain: "green-valley.myprop.live", leads: 189, views: 987 },
              { name: "Marina Bay Apartments", domain: "marina-bay.myprop.live", leads: 156, views: 756 },
            ].map((site, index) => (
              <div key={index} className="p-6 rounded-xl border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{site.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{site.domain}</p>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-slate-500">Leads</p>
                    <p className="font-bold text-slate-900">{site.leads}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Views</p>
                    <p className="font-bold text-slate-900">{site.views}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Website Wizard */}
      <CreateWebsiteWizard open={open} onOpenChange={setOpen} />
      {/* Add Lead Dialog */}
      <AddLeadDialog open={addLeadOpen} onOpenChange={setAddLeadOpen} />
    </div>
  );
}