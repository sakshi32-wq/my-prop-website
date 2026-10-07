import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  MessageSquare,
  Mail,
  Users,
  CalendarClock,
  Zap,
  Target,
  Send,
  Wand2,
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Card, CardHeader, CardContent } from "./ui/card";

interface CreateCampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const audienceSegments = [
  { id: "all", name: "All Leads", count: 1247 },
  { id: "hot", name: "Hot Leads", count: 234 },
  { id: "warm", name: "Warm Leads", count: 456 },
  { id: "cold", name: "Cold Leads", count: 557 },
  { id: "skyline", name: "Skyline Heights Interested", count: 189 },
  { id: "green-valley", name: "Green Valley Interested", count: 156 },
];

const messageTemplates = [
  {
    id: 1,
    name: "New Launch Announcement",
    preview: "🏡 Exciting News! We're launching our newest project...",
    category: "launch"
  },
  {
    id: 2,
    name: "Site Visit Invitation",
    preview: "📍 Schedule your exclusive site visit this weekend...",
    category: "visit"
  },
  {
    id: 3,
    name: "Limited Offer",
    preview: "⚡ Limited time offer! Get special pricing on select units...",
    category: "offer"
  },
  {
    id: 4,
    name: "Follow-up Message",
    preview: "👋 Hi {name}, following up on your recent inquiry about...",
    category: "followup"
  },
];

export function CreateCampaignWizard({ open, onOpenChange }: CreateCampaignWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    campaignName: "",
    objective: "",
    channel: "whatsapp" as "whatsapp" | "email",
    selectedAudience: [] as string[],
    estimatedReach: 0,
    messageTemplate: 1,
    messageContent: "",
    subject: "",
    useAI: true,
    aiTone: "friendly",
    scheduleType: "immediate" as "immediate" | "scheduled" | "triggered",
    scheduleDate: "",
    scheduleTime: "",
    triggerEvent: "",
    frequency: "once" as "once" | "daily" | "weekly",
  });

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Creating campaign with data:", formData);
    onOpenChange(false);
    // Reset form
    setStep(1);
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

  const generateWithAI = () => {
    // Simulate AI generation
    const generatedMessage = `Hi {name}! 👋

We're excited to share some amazing opportunities with you at our latest property project.

🏡 Key Highlights:
• Prime location with excellent connectivity
• World-class amenities
• Special launch offers available

Would you like to schedule a site visit this weekend?

Reply YES to confirm or call us at +91-XXXXXXXXXX

Team myprop.live`;
    
    setFormData({ ...formData, messageContent: generatedMessage });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Create New Campaign
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span className={step >= 1 ? "text-emerald-600 font-medium" : ""}>Basics</span>
            <span className={step >= 2 ? "text-emerald-600 font-medium" : ""}>Audience</span>
            <span className={step >= 3 ? "text-emerald-600 font-medium" : ""}>Message</span>
            <span className={step >= 4 ? "text-emerald-600 font-medium" : ""}>Schedule</span>
            <span className={step >= 5 ? "text-emerald-600 font-medium" : ""}>Review</span>
          </div>
        </div>

        {/* Step 1: Campaign Basics */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Campaign Basics</h3>
              </div>
              <p className="text-sm text-slate-600">Set up your campaign details and goals</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="campaignName">Campaign Name *</Label>
                <Input
                  id="campaignName"
                  placeholder="e.g., Skyline Heights Launch Campaign"
                  value={formData.campaignName}
                  onChange={(e) => setFormData({ ...formData, campaignName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="objective">Campaign Objective</Label>
                <Select
                  value={formData.objective}
                  onValueChange={(value) => setFormData({ ...formData, objective: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select campaign objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="awareness">Brand Awareness</SelectItem>
                    <SelectItem value="leads">Generate Leads</SelectItem>
                    <SelectItem value="sitevisit">Drive Site Visits</SelectItem>
                    <SelectItem value="conversion">Boost Conversions</SelectItem>
                    <SelectItem value="nurture">Lead Nurturing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Communication Channel *</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={() => setFormData({ ...formData, channel: "whatsapp" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.channel === "whatsapp"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                    <p className="font-medium text-slate-900">WhatsApp</p>
                    <p className="text-xs text-slate-600 mt-1">High engagement rate</p>
                    {formData.channel === "whatsapp" && (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto mt-2" />
                    )}
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, channel: "email" })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.channel === "email"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Mail className="w-8 h-8 mx-auto mb-2 text-teal-600" />
                    <p className="font-medium text-slate-900">Email</p>
                    <p className="text-xs text-slate-600 mt-1">Professional reach</p>
                    {formData.channel === "email" && (
                      <Check className="w-5 h-5 text-emerald-600 mx-auto mt-2" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Audience Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">Select Your Audience</h3>
              </div>
              <p className="text-sm text-slate-600">Choose which leads will receive this campaign</p>
            </div>

            <div className="space-y-3">
              <Label>Audience Segments</Label>
              {audienceSegments.map((segment) => (
                <button
                  key={segment.id}
                  onClick={() => toggleAudience(segment.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    formData.selectedAudience.includes(segment.id)
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {formData.selectedAudience.includes(segment.id) && (
                        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-slate-900">{segment.name}</p>
                        <p className="text-sm text-slate-600">{segment.count} leads</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{segment.count}</Badge>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Estimated Reach</p>
                  <p className="text-2xl font-bold text-emerald-600">{formData.estimatedReach} leads</p>
                </div>
                <Users className="w-10 h-10 text-emerald-600 opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Message Content */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">Compose Your Message</h3>
              </div>
              <p className="text-sm text-slate-600">Create engaging content for your campaign</p>
            </div>

            <div className="space-y-4">
              {formData.channel === "email" && (
                <div>
                  <Label htmlFor="subject">Email Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Exclusive Launch Offer - Skyline Heights"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Message Template</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={generateWithAI}
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    <Wand2 className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-2 mb-3">
                  {messageTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setFormData({ ...formData, messageTemplate: template.id });
                        // You could load template content here
                      }}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        formData.messageTemplate === template.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{template.name}</p>
                          <p className="text-xs text-slate-600 mt-1">{template.preview}</p>
                        </div>
                        {formData.messageTemplate === template.id && (
                          <Check className="w-4 h-4 text-emerald-600 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="messageContent">Message Content *</Label>
                <Textarea
                  id="messageContent"
                  placeholder="Type your message here... Use {name} for personalization"
                  value={formData.messageContent}
                  onChange={(e) => setFormData({ ...formData, messageContent: e.target.value })}
                  className="mt-1 font-mono text-sm"
                  rows={10}
                />
                <p className="text-xs text-slate-500 mt-2">
                  💡 Tip: Use {"{name}"}, {"{project}"}, {"{location}"} for personalization
                </p>
              </div>

              <div>
                <Label htmlFor="aiTone">AI Tone (for future generation)</Label>
                <Select
                  value={formData.aiTone}
                  onValueChange={(value) => setFormData({ ...formData, aiTone: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                    <SelectItem value="professional">Professional & Formal</SelectItem>
                    <SelectItem value="urgent">Urgent & Action-Oriented</SelectItem>
                    <SelectItem value="luxury">Luxury & Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Schedule & Automation */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <CalendarClock className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">Schedule Your Campaign</h3>
              </div>
              <p className="text-sm text-slate-600">Choose when and how to send your campaign</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Send Type</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  <button
                    onClick={() => setFormData({ ...formData, scheduleType: "immediate" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.scheduleType === "immediate"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Zap className="w-6 h-6 text-emerald-600" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Send Immediately</p>
                        <p className="text-sm text-slate-600">Start campaign right away</p>
                      </div>
                      {formData.scheduleType === "immediate" && (
                        <Check className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, scheduleType: "scheduled" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.scheduleType === "scheduled"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className="w-6 h-6 text-teal-600" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Schedule for Later</p>
                        <p className="text-sm text-slate-600">Pick a specific date and time</p>
                      </div>
                      {formData.scheduleType === "scheduled" && (
                        <Check className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, scheduleType: "triggered" })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.scheduleType === "triggered"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">Trigger-Based</p>
                        <p className="text-sm text-slate-600">Send based on lead actions</p>
                      </div>
                      {formData.scheduleType === "triggered" && (
                        <Check className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {formData.scheduleType === "scheduled" && (
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

              {formData.scheduleType === "triggered" && (
                <div>
                  <Label htmlFor="triggerEvent">Trigger Event</Label>
                  <Select
                    value={formData.triggerEvent}
                    onValueChange={(value) => setFormData({ ...formData, triggerEvent: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select trigger event" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-lead">New Lead Added</SelectItem>
                      <SelectItem value="form-submit">Form Submission</SelectItem>
                      <SelectItem value="site-visit">After Site Visit</SelectItem>
                      <SelectItem value="no-response">No Response in 3 Days</SelectItem>
                      <SelectItem value="stage-change">Pipeline Stage Change</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="frequency">Campaign Frequency</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData({ ...formData, frequency: value as any })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">One-time Campaign</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Launch */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Review & Launch</h3>
              </div>
              <p className="text-sm text-slate-600">Review your campaign details before launching</p>
            </div>

            {/* Campaign Summary */}
            <div className="space-y-4">
              <Card className="border-2">
                <CardHeader>
                  <h4 className="font-bold text-slate-900">Campaign Summary</h4>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Campaign Name:</span>
                    <span className="font-medium text-slate-900">{formData.campaignName || "Not set"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Channel:</span>
                    <Badge variant="secondary" className="capitalize">
                      {formData.channel === "whatsapp" ? (
                        <><MessageSquare className="w-3 h-3 mr-1" /> WhatsApp</>
                      ) : (
                        <><Mail className="w-3 h-3 mr-1" /> Email</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Objective:</span>
                    <span className="font-medium text-slate-900 capitalize">{formData.objective || "Not set"}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Estimated Reach:</span>
                    <span className="font-medium text-emerald-600">{formData.estimatedReach} leads</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-600">Schedule:</span>
                    <span className="font-medium text-slate-900 capitalize">
                      {formData.scheduleType === "immediate" && "Send Immediately"}
                      {formData.scheduleType === "scheduled" && `${formData.scheduleDate} at ${formData.scheduleTime}`}
                      {formData.scheduleType === "triggered" && "Trigger-Based"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-600">Frequency:</span>
                    <span className="font-medium text-slate-900 capitalize">{formData.frequency}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Message Preview */}
              <Card className="border-2">
                <CardHeader>
                  <h4 className="font-bold text-slate-900">Message Preview</h4>
                </CardHeader>
                <CardContent>
                  {formData.channel === "email" && formData.subject && (
                    <div className="mb-3 p-3 bg-slate-50 rounded">
                      <p className="text-xs text-slate-600">Subject:</p>
                      <p className="font-medium text-slate-900">{formData.subject}</p>
                    </div>
                  )}
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-sm text-slate-900 whitespace-pre-wrap">
                      {formData.messageContent || "No message content"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-900 mb-1">Ready to Launch?</p>
                    <p className="text-sm text-amber-700">
                      This campaign will be sent to {formData.estimatedReach} leads. Make sure your message is ready!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-slate-200">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            {step === totalSteps ? (
              <>
                <Send className="w-4 h-4 mr-2" />
                Launch Campaign
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}