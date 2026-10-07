import { useState } from "react";
import { Link } from "react-router";
import { 
  Plus, 
  Globe, 
  Eye, 
  Users, 
  ExternalLink, 
  Settings, 
  Copy, 
  BarChart,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Gift,
  Bell,
  Video,
  Calculator,
  Gauge
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CreateWebsiteWizard } from "../components/CreateWebsiteWizard";
import { LighthouseReportDialog } from "../components/LighthouseReportDialog";

const websites = [
  {
    id: 1,
    name: "Skyline Heights",
    domain: "skyline-heights.myprop.live",
    status: "live",
    leads: 234,
    views: 1245,
    conversion: "18.8%",
    thumbnail: "photo-1560518883-ce09059eeffa",
    enabledTools: [
      { name: "Contact Form", icon: Mail },
      { name: "WhatsApp Chat", icon: Phone },
      { name: "Schedule Visit", icon: Calendar },
      { name: "Google Analytics", icon: BarChart }
    ]
  },
  {
    id: 2,
    name: "Green Valley Villas",
    domain: "green-valley.myprop.live",
    status: "live",
    leads: 189,
    views: 987,
    conversion: "19.1%",
    thumbnail: "photo-1512917774080-9991f1c4c750",
    enabledTools: [
      { name: "Contact Form", icon: Mail },
      { name: "WhatsApp Chat", icon: Phone },
      { name: "EMI Calculator", icon: Calculator },
      { name: "Virtual Tour", icon: Video }
    ]
  },
  {
    id: 3,
    name: "Marina Bay Apartments",
    domain: "marina-bay.myprop.live",
    status: "live",
    leads: 156,
    views: 756,
    conversion: "20.6%",
    thumbnail: "photo-1545324418-cc1a3fa10c00",
    enabledTools: [
      { name: "Contact Form", icon: Mail },
      { name: "Live Chat", icon: MessageSquare },
      { name: "Promotion Banner", icon: Gift },
      { name: "Push Notifications", icon: Bell }
    ]
  },
  {
    id: 4,
    name: "Riverside Residency",
    domain: "riverside.myprop.live",
    status: "draft",
    leads: 0,
    views: 0,
    conversion: "0%",
    thumbnail: "photo-1486406146926-c627a92ad1ab",
    enabledTools: [
      { name: "Contact Form", icon: Mail },
      { name: "WhatsApp Chat", icon: Phone }
    ]
  },
];

export function Websites() {
  const [showWizard, setShowWizard] = useState(false);
  const [showLighthouseReport, setShowLighthouseReport] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState<typeof websites[0] | null>(null);

  const handleOpenLighthouse = (site: typeof websites[0]) => {
    setSelectedWebsite(site);
    setShowLighthouseReport(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Websites</h1>
          <p className="text-slate-600 mt-1">Manage your property websites and microsites</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700" onClick={() => setShowWizard(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Website
        </Button>
      </div>

      {/* Website Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {websites.map((site) => (
          <Card key={site.id} className="overflow-hidden border-2 hover:border-emerald-300 hover:shadow-xl transition-all group">
            <div className="aspect-[16/10] bg-slate-200 relative overflow-hidden">
              <img 
                src={`https://images.unsplash.com/${site.thumbnail}?w=600&h=400&fit=crop`}
                alt={site.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 right-3">
                <Badge className={site.status === 'live' ? 'bg-emerald-500' : 'bg-amber-500'}>
                  {site.status === 'live' ? '● Live' : '● Draft'}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Link to={`/app/websites/${site.id}/builder`}>
                  <Button size="sm" variant="secondary">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button size="sm" variant="secondary">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{site.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{site.domain}</span>
                    <button className="text-emerald-600 hover:text-emerald-700">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                    <Eye className="w-3 h-3" />
                    <span>Views</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{site.views}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                    <Users className="w-3 h-3" />
                    <span>Leads</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900">{site.leads}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mb-1">
                    <BarChart className="w-3 h-3" />
                    <span>CVR</span>
                  </div>
                  <p className="text-lg font-bold text-emerald-600">{site.conversion}</p>
                </div>
              </div>

              {/* Enabled Tools */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-500 mb-2">Enabled Tools ({site.enabledTools.length})</p>
                <div className="flex flex-wrap gap-2">
                  {site.enabledTools.map((tool, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs"
                    >
                      <tool.icon className="w-3 h-3 mr-1" />
                      {tool.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200">
                <Link to={`/app/websites/${site.id}/builder`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Edit Website
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleOpenLighthouse(site)}
                  className="border-emerald-300 hover:bg-emerald-50"
                >
                  <Gauge className="w-4 h-4 text-emerald-600" />
                </Button>
                <Button size="sm" variant="ghost">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Card */}
        <Card className="border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-center" onClick={() => setShowWizard(true)}>
          <CardContent className="text-center p-12">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Create New Website</h3>
            <p className="text-sm text-slate-600">Start building your property website with AI</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Website Wizard */}
      <CreateWebsiteWizard open={showWizard} onOpenChange={setShowWizard} />
      {/* Lighthouse Report Dialog */}
      <LighthouseReportDialog open={showLighthouseReport} onOpenChange={setShowLighthouseReport} website={selectedWebsite} />
    </div>
  );
}