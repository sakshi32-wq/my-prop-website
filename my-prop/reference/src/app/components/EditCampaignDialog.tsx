import { useState, useEffect } from "react";
import {
  MessageSquare,
  Mail,
  Users,
  CalendarClock,
  Target,
  Clock,
  Phone,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: "active" | "paused" | "scheduled";
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  leads: number;
  schedule: string;
}

interface EditCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: Campaign | null;
  onSave: (campaign: Campaign) => void;
}

const audienceSegments = [
  { id: "all", name: "All Leads", count: 1247 },
  { id: "hot", name: "Hot Leads", count: 234 },
  { id: "warm", name: "Warm Leads", count: 456 },
  { id: "cold", name: "Cold Leads", count: 557 },
  { id: "skyline", name: "Skyline Heights Interested", count: 189 },
  { id: "green-valley", name: "Green Valley Interested", count: 156 },
];

export function EditCampaignDialog({ open, onOpenChange, campaign, onSave }: EditCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "WhatsApp",
    status: "active" as "active" | "paused" | "scheduled",
    schedule: "immediate",
    scheduleDate: "",
    scheduleTime: "",
    frequency: "once",
    selectedAudience: [] as string[],
    estimatedReach: 0,
    messageContent: "",
    subject: "",
  });

  // Populate form when campaign changes
  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        type: campaign.type,
        status: campaign.status,
        schedule: campaign.schedule.includes("Running") ? "immediate" : 
                  campaign.schedule.includes("Daily") ? "recurring" : 
                  campaign.schedule.includes("Paused") ? "paused" : "scheduled",
        scheduleDate: "",
        scheduleTime: "",
        frequency: campaign.schedule.includes("Daily") ? "daily" : "once",
        selectedAudience: ["all"],
        estimatedReach: 1247,
        messageContent: "Hi {name}! 👋\n\nWe're excited to share updates about our latest property...",
        subject: campaign.type === "Email" ? campaign.name : "",
      });
    }
  }, [campaign]);

  const handleSave = () => {
    if (!campaign) return;

    const updatedCampaign: Campaign = {
      ...campaign,
      name: formData.name,
      type: formData.type,
      status: formData.status,
      schedule: formData.schedule === "immediate" ? "Running now" :
                formData.schedule === "recurring" && formData.frequency === "daily" ? "Daily at 10 AM" :
                formData.schedule === "scheduled" ? `Scheduled: ${formData.scheduleDate}` :
                "Paused",
    };

    onSave(updatedCampaign);
    toast.success("Campaign updated successfully!");
    onOpenChange(false);
  };

  const toggleAudience = (audienceId: string) => {
    setFormData(prev => {
      const newAudience = prev.selectedAudience.includes(audienceId)
        ? prev.selectedAudience.filter(a => a !== audienceId)
        : [...prev.selectedAudience, audienceId];
      
      // Calculate estimated reach
      const reach = audienceSegments
        .filter(seg => newAudience.includes(seg.id))
        .reduce((sum, seg) => sum + seg.count, 0);
      
      return {
        ...prev,
        selectedAudience: newAudience,
        estimatedReach: reach
      };
    });
  };

  if (!campaign) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {formData.type === "WhatsApp" ? (
              <MessageSquare className="w-5 h-5 text-green-600" />
            ) : (
              <Mail className="w-5 h-5 text-blue-600" />
            )}
            Edit Campaign
          </DialogTitle>
          <DialogDescription>
            Update campaign settings, audience, and content
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="message">Message</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Skyline Heights Launch Campaign"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="type">Channel Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WhatsApp">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        WhatsApp
                      </div>
                    </SelectItem>
                    <SelectItem value="Email">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        Email
                      </div>
                    </SelectItem>
                    <SelectItem value="SMS">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-purple-600" />
                        SMS
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Campaign Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        Active
                      </div>
                    </SelectItem>
                    <SelectItem value="paused">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                        Paused
                      </div>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Scheduled
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Audience Tab */}
            <TabsContent value="audience" className="space-y-4 mt-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <span className="font-medium text-slate-900">Estimated Reach</span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formData.estimatedReach.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <Label>Select Audience Segments *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {audienceSegments.map((segment) => (
                    <button
                      key={segment.id}
                      onClick={() => toggleAudience(segment.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        formData.selectedAudience.includes(segment.id)
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900">{segment.name}</p>
                          <p className="text-sm text-slate-600">{segment.count.toLocaleString()} contacts</p>
                        </div>
                        {formData.selectedAudience.includes(segment.id) && (
                          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Message Tab */}
            <TabsContent value="message" className="space-y-4 mt-4">
              {formData.type === "Email" && (
                <div>
                  <Label htmlFor="subject">Email Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter email subject"
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="message">Message Content *</Label>
                <Textarea
                  id="message"
                  value={formData.messageContent}
                  onChange={(e) => setFormData({ ...formData, messageContent: e.target.value })}
                  placeholder="Type your message here..."
                  rows={10}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Use variables: {"{name}"}, {"{project}"}, {"{agent}"}, {"{phone}"}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs font-medium text-slate-700 mb-2">Preview</p>
                <div className="bg-white p-4 rounded-lg border border-slate-200 whitespace-pre-wrap text-sm">
                  {formData.messageContent || "Your message preview will appear here..."}
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="schedule">Schedule Type *</Label>
                <Select
                  value={formData.schedule}
                  onValueChange={(value) => setFormData({ ...formData, schedule: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Send Immediately
                      </div>
                    </SelectItem>
                    <SelectItem value="scheduled">
                      <div className="flex items-center gap-2">
                        <CalendarClock className="w-4 h-4" />
                        Schedule for Later
                      </div>
                    </SelectItem>
                    <SelectItem value="recurring">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Recurring Campaign
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.schedule === "scheduled" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduleDate">Date</Label>
                    <Input
                      id="scheduleDate"
                      type="date"
                      value={formData.scheduleDate}
                      onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="scheduleTime">Time</Label>
                    <Input
                      id="scheduleTime"
                      type="time"
                      value={formData.scheduleTime}
                      onChange={(e) => setFormData({ ...formData, scheduleTime: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {formData.schedule === "recurring" && (
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Current Schedule:</strong>{" "}
                  {formData.schedule === "immediate" && "Campaign will run immediately"}
                  {formData.schedule === "scheduled" && formData.scheduleDate && 
                    `Scheduled for ${formData.scheduleDate} at ${formData.scheduleTime || "00:00"}`}
                  {formData.schedule === "recurring" && 
                    `Recurring ${formData.frequency}`}
                  {formData.schedule === "scheduled" && !formData.scheduleDate &&
                    "Please select a date and time"}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
