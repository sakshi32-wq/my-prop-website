import { useState } from "react";
import { 
  Plus, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  Play,
  Pause,
  MessageSquare,
  Mail,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Circle,
  ArrowRight
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { CreateCampaignWizard } from "../components/CreateCampaignWizard";
import { EditCampaignDialog } from "../components/EditCampaignDialog";
import { AutomationBuilder } from "../components/AutomationBuilder";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";

const campaignsData = [
  {
    id: 1,
    name: "Skyline Heights Launch",
    type: "WhatsApp",
    status: "active",
    sent: 1245,
    delivered: 1198,
    read: 892,
    replied: 234,
    leads: 45,
    schedule: "Running now"
  },
  {
    id: 2,
    name: "Green Valley Promotion",
    type: "Email",
    status: "active",
    sent: 3456,
    delivered: 3289,
    read: 1456,
    replied: 89,
    leads: 28,
    schedule: "Daily at 10 AM"
  },
  {
    id: 3,
    name: "Marina Bay Follow-up",
    type: "WhatsApp",
    status: "paused",
    sent: 567,
    delivered: 542,
    read: 398,
    replied: 156,
    leads: 32,
    schedule: "Paused"
  },
  {
    id: 4,
    name: "Weekend Site Visit",
    type: "Email",
    status: "scheduled",
    sent: 0,
    delivered: 0,
    read: 0,
    replied: 0,
    leads: 0,
    schedule: "Tomorrow at 9 AM"
  },
];

export function Campaigns() {
  const [view, setView] = useState<"list" | "automation">("list");
  const [showWizard, setShowWizard] = useState(false);
  const [campaigns, setCampaigns] = useState(campaignsData);
  const [selectedCampaign, setSelectedCampaign] = useState<typeof campaignsData[0] | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);

  // Handler to view campaign details
  const handleViewCampaign = (campaign: typeof campaignsData[0]) => {
    setSelectedCampaign(campaign);
    setShowViewDialog(true);
  };

  // Handler to edit campaign
  const handleEditCampaign = (campaign: typeof campaignsData[0]) => {
    setSelectedCampaign(campaign);
    setShowEditDialog(true);
  };

  // Handler to save edited campaign
  const handleSaveEditedCampaign = (updatedCampaign: typeof campaignsData[0]) => {
    setCampaigns(prev => prev.map(c => c.id === updatedCampaign.id ? updatedCampaign : c));
  };

  // Handler to pause/resume campaign
  const handleToggleCampaign = (campaignId: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === campaignId) {
        const newStatus = c.status === "active" ? "paused" : "active";
        toast.success(`Campaign ${newStatus === "paused" ? "paused" : "resumed"} successfully`);
        return { ...c, status: newStatus as "active" | "paused" | "scheduled" };
      }
      return c;
    }));
  };

  // Handler to delete campaign
  const handleDeleteCampaign = () => {
    if (campaignToDelete) {
      setCampaigns(prev => prev.filter(c => c.id !== campaignToDelete));
      toast.success("Campaign deleted successfully");
      setShowDeleteDialog(false);
      setCampaignToDelete(null);
    }
  };

  // Handler to open delete confirmation
  const handleOpenDeleteDialog = (campaignId: number) => {
    setCampaignToDelete(campaignId);
    setShowDeleteDialog(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Campaigns & Automation</h1>
          <p className="text-slate-600 mt-1">Create and manage marketing campaigns</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              Campaign List
            </Button>
            <Button
              variant={view === "automation" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("automation")}
            >
              Automation Builder
            </Button>
          </div>
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            onClick={() => setShowWizard(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {view === "list" ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Sent</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">5,268</p>
                  </div>
                  <Send className="w-10 h-10 text-emerald-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Delivery Rate</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">95.8%</p>
                  </div>
                  <CheckCircle2 className="w-10 h-10 text-teal-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Reply Rate</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">12.4%</p>
                  </div>
                  <MessageSquare className="w-10 h-10 text-amber-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Leads Generated</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">105</p>
                  </div>
                  <TrendingUp className="w-10 h-10 text-rose-600 opacity-20" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Campaigns List */}
          <Card>
            <CardHeader>
              <CardTitle>All Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-6 rounded-xl border-2 border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          campaign.type === "WhatsApp" ? "bg-green-100" : "bg-blue-100"
                        }`}>
                          {campaign.type === "WhatsApp" ? (
                            <MessageSquare className={`w-6 h-6 ${
                              campaign.type === "WhatsApp" ? "text-green-600" : "text-blue-600"
                            }`} />
                          ) : (
                            <Mail className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 mb-1">{campaign.name}</h3>
                          <div className="flex items-center gap-3">
                            <Badge variant={
                              campaign.status === "active" ? "default" :
                              campaign.status === "paused" ? "secondary" :
                              "outline"
                            }>
                              {campaign.status === "active" ? "● Active" :
                               campaign.status === "paused" ? "⏸ Paused" :
                               "⏰ Scheduled"}
                            </Badge>
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {campaign.schedule}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleViewCampaign(campaign)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditCampaign(campaign)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        {campaign.status === "active" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleToggleCampaign(campaign.id)}>
                            <Pause className="w-4 h-4" />
                          </Button>
                        ) : campaign.status === "paused" ? (
                          <Button variant="ghost" size="sm" onClick={() => handleToggleCampaign(campaign.id)}>
                            <Play className="w-4 h-4" />
                          </Button>
                        ) : null}
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleOpenDeleteDialog(campaign.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-6">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Sent</p>
                        <p className="text-xl font-bold text-slate-900">{campaign.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Delivered</p>
                        <p className="text-xl font-bold text-emerald-600">{campaign.delivered.toLocaleString()}</p>
                        {campaign.sent > 0 && (
                          <p className="text-xs text-slate-500">
                            {((campaign.delivered / campaign.sent) * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Read</p>
                        <p className="text-xl font-bold text-teal-600">{campaign.read.toLocaleString()}</p>
                        {campaign.delivered > 0 && (
                          <p className="text-xs text-slate-500">
                            {((campaign.read / campaign.delivered) * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Replied</p>
                        <p className="text-xl font-bold text-amber-600">{campaign.replied.toLocaleString()}</p>
                        {campaign.read > 0 && (
                          <p className="text-xs text-slate-500">
                            {((campaign.replied / campaign.read) * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Leads</p>
                        <p className="text-xl font-bold text-rose-600">{campaign.leads}</p>
                        {campaign.replied > 0 && (
                          <p className="text-xs text-slate-500">
                            {((campaign.leads / campaign.replied) * 100).toFixed(1)}% CVR
                          </p>
                        )}
                      </div>
                    </div>

                    {campaign.sent > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-sm text-slate-600">Campaign Progress</p>
                          <div className="flex-1">
                            <Progress value={(campaign.delivered / campaign.sent) * 100} className="h-2" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        // Automation Builder View
        <AutomationBuilder />
      )}
      
      {/* Create Campaign Wizard */}
      <CreateCampaignWizard open={showWizard} onOpenChange={setShowWizard} />

      {/* Edit Campaign Dialog */}
      <EditCampaignDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog}
        campaign={selectedCampaign}
        onSave={handleSaveEditedCampaign}
      />

      {/* View Campaign Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Campaign Details</DialogTitle>
            <DialogDescription>
              View detailed information about the selected campaign.
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  selectedCampaign.type === "WhatsApp" ? "bg-green-100" : "bg-blue-100"
                }`}>
                  {selectedCampaign.type === "WhatsApp" ? (
                    <MessageSquare className={`w-6 h-6 ${
                      selectedCampaign.type === "WhatsApp" ? "text-green-600" : "text-blue-600"
                    }`} />
                  ) : (
                    <Mail className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{selectedCampaign.name}</h3>
                  <div className="flex items-center gap-3">
                    <Badge variant={
                      selectedCampaign.status === "active" ? "default" :
                      selectedCampaign.status === "paused" ? "secondary" :
                      "outline"
                    }>
                      {selectedCampaign.status === "active" ? "● Active" :
                       selectedCampaign.status === "paused" ? "⏸ Paused" :
                       "⏰ Scheduled"}
                    </Badge>
                    <span className="text-sm text-slate-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {selectedCampaign.schedule}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Sent</p>
                  <p className="text-xl font-bold text-slate-900">{selectedCampaign.sent.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Delivered</p>
                  <p className="text-xl font-bold text-emerald-600">{selectedCampaign.delivered.toLocaleString()}</p>
                  {selectedCampaign.sent > 0 && (
                    <p className="text-xs text-slate-500">
                      {((selectedCampaign.delivered / selectedCampaign.sent) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Read</p>
                  <p className="text-xl font-bold text-teal-600">{selectedCampaign.read.toLocaleString()}</p>
                  {selectedCampaign.delivered > 0 && (
                    <p className="text-xs text-slate-500">
                      {((selectedCampaign.read / selectedCampaign.delivered) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Replied</p>
                  <p className="text-xl font-bold text-amber-600">{selectedCampaign.replied.toLocaleString()}</p>
                  {selectedCampaign.read > 0 && (
                    <p className="text-xs text-slate-500">
                      {((selectedCampaign.replied / selectedCampaign.read) * 100).toFixed(1)}%
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Leads</p>
                  <p className="text-xl font-bold text-rose-600">{selectedCampaign.leads}</p>
                  {selectedCampaign.replied > 0 && (
                    <p className="text-xs text-slate-500">
                      {((selectedCampaign.leads / selectedCampaign.replied) * 100).toFixed(1)}% CVR
                    </p>
                  )}
                </div>
              </div>

              {selectedCampaign.sent > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm text-slate-600">Campaign Progress</p>
                    <div className="flex-1">
                      <Progress value={(selectedCampaign.delivered / selectedCampaign.sent) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Campaign Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCampaign}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}