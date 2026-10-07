import { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MessageSquare, 
  Calendar,
  MoreVertical,
  User,
  DollarSign,
  MapPin,
  Clock,
  Tag,
  X,
  Edit,
  Trash2,
  Copy,
  CheckCircle2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { AddLeadDialog } from "../components/AddLeadDialog";
import { EditLeadDialog } from "../components/EditLeadDialog";
import { SendWhatsAppDialog } from "../components/SendWhatsAppDialog";
import { ScheduleVisitDialog } from "../components/ScheduleVisitDialog";
import { CallLeadDialog } from "../components/CallLeadDialog";
import { AddTagsDialog } from "../components/AddTagsDialog";
import { LeadFilters, LeadFiltersType } from "../components/LeadFilters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const columns = [
  { id: "new", name: "New Lead", color: "bg-slate-100", count: 12 },
  { id: "contacted", name: "Contacted", color: "bg-blue-100", count: 8 },
  { id: "interested", name: "Interested", color: "bg-purple-100", count: 15 },
  { id: "scheduled", name: "Site Visit Scheduled", color: "bg-amber-100", count: 6 },
  { id: "negotiation", name: "Negotiation", color: "bg-orange-100", count: 9 },
  { id: "closed", name: "Closed", color: "bg-emerald-100", count: 5 },
  { id: "lost", name: "Lost", color: "bg-rose-100", count: 3 },
];

const leadsData = {
  new: [
    {
      id: 1,
      name: "Rahul Sharma",
      phone: "+91 98765 43210",
      email: "rahul@example.com",
      budget: "₹80L - 1Cr",
      source: "Website",
      project: "Skyline Heights",
      time: "2 hours ago",
      tags: ["Hot Lead", "2BHK"]
    },
    {
      id: 2,
      name: "Priya Patel",
      phone: "+91 98765 43211",
      email: "priya@example.com",
      budget: "₹1.2Cr - 1.5Cr",
      source: "WhatsApp",
      project: "Marina Bay",
      time: "5 hours ago",
      tags: ["3BHK"]
    },
  ],
  contacted: [
    {
      id: 3,
      name: "Amit Kumar",
      phone: "+91 98765 43212",
      email: "amit@example.com",
      budget: "₹60L - 80L",
      source: "Social Media",
      project: "Green Valley",
      time: "1 day ago",
      tags: ["First Time Buyer"]
    },
  ],
  interested: [
    {
      id: 4,
      name: "Neha Singh",
      phone: "+91 98765 43213",
      email: "neha@example.com",
      budget: "₹2Cr+",
      source: "Referral",
      project: "Skyline Heights",
      time: "2 days ago",
      tags: ["Hot Lead", "Penthouse"]
    },
    {
      id: 5,
      name: "Vikram Mehta",
      phone: "+91 98765 43214",
      email: "vikram@example.com",
      budget: "₹90L - 1.2Cr",
      source: "Website",
      project: "Marina Bay",
      time: "2 days ago",
      tags: ["3BHK", "Investor"]
    },
  ],
  scheduled: [
    {
      id: 6,
      name: "Anjali Desai",
      phone: "+91 98765 43215",
      email: "anjali@example.com",
      budget: "₹1Cr - 1.3Cr",
      source: "WhatsApp",
      project: "Green Valley",
      time: "3 days ago",
      tags: ["Site Visit: Tomorrow"]
    },
  ],
  negotiation: [
    {
      id: 7,
      name: "Rajesh Gupta",
      phone: "+91 98765 43216",
      email: "rajesh@example.com",
      budget: "₹1.5Cr",
      source: "Website",
      project: "Skyline Heights",
      time: "5 days ago",
      tags: ["Final Stage", "3BHK"]
    },
  ],
  closed: [
    {
      id: 8,
      name: "Sunita Verma",
      phone: "+91 98765 43217",
      email: "sunita@example.com",
      budget: "₹95L",
      source: "Referral",
      project: "Marina Bay",
      time: "1 week ago",
      tags: ["Closed - Won", "2BHK"]
    },
  ],
  lost: [],
};

export function Leads() {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isAddLeadDialogOpen, setIsAddLeadDialogOpen] = useState(false);
  const [isEditLeadDialogOpen, setIsEditLeadDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isWhatsAppDialogOpen, setIsWhatsAppDialogOpen] = useState(false);
  const [isScheduleVisitDialogOpen, setIsScheduleVisitDialogOpen] = useState(false);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isAddTagsDialogOpen, setIsAddTagsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<LeadFiltersType>({
    sources: [],
    budgetRanges: [],
    configurations: [],
    projects: [],
    tags: [],
    stages: [],
    dateRange: {
      from: "",
      to: ""
    }
  });

  const handleClearFilters = () => {
    setFilters({
      sources: [],
      budgetRanges: [],
      configurations: [],
      projects: [],
      tags: [],
      stages: [],
      dateRange: {
        from: "",
        to: ""
      }
    });
  };

  const handleEditLead = (lead: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingLead(lead);
    setIsEditLeadDialogOpen(true);
  };

  const handleSaveLead = (updatedLead: any) => {
    // In a real app, this would update the lead in the database
    console.log("Saving lead:", updatedLead);
    // You would update the leadsData here
  };

  const handleDeleteLead = (leadId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this lead?")) {
      console.log("Deleting lead:", leadId);
      // In a real app, this would delete the lead from the database
    }
  };

  const handleDuplicateLead = (lead: any, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Duplicating lead:", lead);
    // In a real app, this would create a copy of the lead
  };

  const handleMarkAsWon = (leadId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Marking lead as won:", leadId);
    // In a real app, this would update the lead stage to closed
  };

  const handleSaveTags = (leadId: number, tags: string[]) => {
    // In a real app, this would update the lead's tags in the database
    console.log("Saving tags for lead:", leadId, tags);
    // Update the selectedLead to reflect the changes
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, tags });
    }
  };

  // Calculate active filter count
  const activeFilterCount = 
    filters.sources.length +
    filters.budgetRanges.length +
    filters.configurations.length +
    filters.projects.length +
    filters.tags.length +
    filters.stages.length +
    (filters.dateRange.from ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lead Management</h1>
          <p className="text-slate-600 mt-1">Track and manage your property leads</p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700" onClick={() => setIsAddLeadDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Search leads by name, phone, email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2 bg-emerald-100 text-emerald-700">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-slate-600 font-medium">Active Filters:</span>
            {filters.sources.map((source) => (
              <Badge key={source} variant="secondary" className="gap-1">
                {source}
                <button
                  onClick={() => setFilters({
                    ...filters,
                    sources: filters.sources.filter(s => s !== source)
                  })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.budgetRanges.map((budget) => (
              <Badge key={budget} variant="secondary" className="gap-1">
                {budget}
                <button
                  onClick={() => setFilters({
                    ...filters,
                    budgetRanges: filters.budgetRanges.filter(b => b !== budget)
                  })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.configurations.map((config) => (
              <Badge key={config} variant="secondary" className="gap-1">
                {config}
                <button
                  onClick={() => setFilters({
                    ...filters,
                    configurations: filters.configurations.filter(c => c !== config)
                  })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.projects.map((project) => (
              <Badge key={project} variant="secondary" className="gap-1">
                {project}
                <button
                  onClick={() => setFilters({
                    ...filters,
                    projects: filters.projects.filter(p => p !== project)
                  })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  onClick={() => setFilters({
                    ...filters,
                    tags: filters.tags.filter(t => t !== tag)
                  })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.stages.map((stage) => (
              <Badge key={stage} variant="secondary" className="gap-1">
                {stage}
                <button
                  onClick={() => setFilters({
                    ...filters,
                    stages: filters.stages.filter(s => s !== stage)
                  })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {filters.dateRange.from && (
              <Badge variant="secondary" className="gap-1">
                From: {filters.dateRange.from}
                <button
                  onClick={() => setFilters({
                    ...filters,
                    dateRange: { ...filters.dateRange, from: "" }
                  })}
                  className="hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearFilters}
              className="text-slate-600 hover:text-slate-900"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`${column.color} rounded-t-lg px-4 py-3 border-b-2 border-slate-300`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{column.name}</h3>
                <Badge variant="secondary" className="bg-white">
                  {column.count}
                </Badge>
              </div>
            </div>
            <div className="bg-slate-50 rounded-b-lg p-3 min-h-[600px] space-y-3">
              {(leadsData[column.id as keyof typeof leadsData] || []).map((lead: any) => (
                <Card
                  key={lead.id}
                  className="p-4 bg-white border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-700">
                          {lead.name.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{lead.name}</h4>
                        <p className="text-xs text-slate-500">{lead.time}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button 
                          className="text-slate-400 hover:text-slate-600"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={(e) => handleEditLead(lead, e)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleDuplicateLead(lead, e)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate Lead
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => handleMarkAsWon(lead.id, e)}>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Mark as Won
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => handleDeleteLead(lead.id, e)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-medium text-slate-900">{lead.budget}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{lead.project}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {lead.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                    <div className="flex-1"></div>
                    <button className="p-1.5 hover:bg-slate-100 rounded">
                      <Phone className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded">
                      <MessageSquare className="w-4 h-4 text-slate-600" />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 rounded">
                      <Mail className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </Card>
              ))}

              {(!leadsData[column.id as keyof typeof leadsData] || leadsData[column.id as keyof typeof leadsData].length === 0) && (
                <div className="text-center py-12 text-slate-400">
                  <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No leads in this stage</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lead Detail Sidebar */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-700">
                    {selectedLead.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{selectedLead.name}</h3>
                  <p className="text-sm text-slate-500">Added {selectedLead.time}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="font-medium text-slate-900">{selectedLead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{selectedLead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-xs text-slate-500">Budget</p>
                      <p className="font-medium text-slate-900">{selectedLead.budget}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-rose-600" />
                    <div>
                      <p className="text-xs text-slate-500">Interested Project</p>
                      <p className="font-medium text-slate-900">{selectedLead.project}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">Activity Timeline</h4>
                <div className="space-y-4">
                  {[
                    { action: "Lead captured via Website", time: "2 hours ago", icon: Clock },
                    { action: "WhatsApp message sent", time: "1 hour ago", icon: MessageSquare },
                    { action: "Email follow-up sent", time: "30 mins ago", icon: Mail },
                  ].map((activity, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{activity.action}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-500 uppercase mb-3">AI Suggested Reply</h4>
                <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-700 leading-relaxed mb-3">
                    "Hi {selectedLead.name.split(' ')[0]}, thank you for your interest in {selectedLead.project}. 
                    I'd love to schedule a site visit for you. Are you available this weekend?"
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600"
                    onClick={() => setIsWhatsAppDialogOpen(true)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send via WhatsApp
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsScheduleVisitDialogOpen(true)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Site Visit
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsCallDialogOpen(true)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Lead
                </Button>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => setIsAddTagsDialogOpen(true)}
                >
                  <Tag className="w-4 h-4 mr-2" />
                  Add Tags
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Dialog */}
      <AddLeadDialog open={isAddLeadDialogOpen} onOpenChange={setIsAddLeadDialogOpen} />
      
      {/* Edit Lead Dialog */}
      <EditLeadDialog open={isEditLeadDialogOpen} onOpenChange={setIsEditLeadDialogOpen} lead={editingLead} onSave={handleSaveLead} />
      
      {/* Send WhatsApp Dialog */}
      <SendWhatsAppDialog open={isWhatsAppDialogOpen} onOpenChange={setIsWhatsAppDialogOpen} lead={selectedLead} />
      
      {/* Schedule Visit Dialog */}
      <ScheduleVisitDialog open={isScheduleVisitDialogOpen} onOpenChange={setIsScheduleVisitDialogOpen} lead={selectedLead} />
      
      {/* Call Lead Dialog */}
      <CallLeadDialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen} lead={selectedLead} />
      
      {/* Add Tags Dialog */}
      <AddTagsDialog open={isAddTagsDialogOpen} onOpenChange={setIsAddTagsDialogOpen} lead={selectedLead} onSaveTags={handleSaveTags} />
      
      {/* Lead Filters Sheet */}
      <LeadFilters 
        open={isFilterOpen} 
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}