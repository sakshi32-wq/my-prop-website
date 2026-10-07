import { useState } from "react";
import { Phone, Save, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";

interface CallLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
}

export function CallLeadDialog({ open, onOpenChange, lead }: CallLeadDialogProps) {
  const [callStatus, setCallStatus] = useState<"not-started" | "in-progress" | "completed">("not-started");
  const [formData, setFormData] = useState({
    outcome: "",
    callDuration: "",
    nextAction: "",
    notes: "",
    sentiment: ""
  });

  const handleStartCall = () => {
    // In a real app, this would integrate with a telephony API
    setCallStatus("in-progress");
    window.open(`tel:${lead?.phone}`, '_self');
  };

  const handleEndCall = () => {
    setCallStatus("completed");
  };

  const handleSave = () => {
    if (!formData.outcome) {
      alert("Please select a call outcome");
      return;
    }

    // In a real app, this would save the call log to the database
    console.log("Saving call log:", {
      lead: lead,
      ...formData,
      timestamp: new Date().toISOString()
    });
    
    alert("Call log saved successfully!");
    onOpenChange(false);
    
    // Reset form
    setCallStatus("not-started");
    setFormData({
      outcome: "",
      callDuration: "",
      nextAction: "",
      notes: "",
      sentiment: ""
    });
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Phone className="w-6 h-6 text-emerald-600" />
            Call Lead
          </DialogTitle>
          <DialogDescription>
            Make a call to {lead.name} and log the details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Information */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-700">
                    {lead.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{lead.name}</h4>
                  <p className="text-sm text-slate-600 font-medium">{lead.phone}</p>
                </div>
              </div>
              {callStatus === "not-started" && (
                <Button
                  onClick={handleStartCall}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Start Call
                </Button>
              )}
              {callStatus === "in-progress" && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                    In Progress
                  </Badge>
                  <Button
                    onClick={handleEndCall}
                    variant="outline"
                    size="sm"
                  >
                    End Call
                  </Button>
                </div>
              )}
              {callStatus === "completed" && (
                <Badge className="bg-emerald-500">Call Ended</Badge>
              )}
            </div>
          </div>

          {/* Lead Context */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-xs text-slate-500 mb-1">Interested Project</p>
              <p className="font-medium text-slate-900">{lead.project}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Budget Range</p>
              <p className="font-medium text-slate-900">{lead.budget}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Lead Source</p>
              <p className="font-medium text-slate-900">{lead.source}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Tags</p>
              <div className="flex gap-1 flex-wrap">
                {lead.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Call Log Form - Only show after call starts */}
          {(callStatus === "in-progress" || callStatus === "completed") && (
            <>
              {/* Call Outcome */}
              <div>
                <Label htmlFor="outcome">Call Outcome *</Label>
                <Select
                  value={formData.outcome}
                  onValueChange={(value) => setFormData({ ...formData, outcome: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="connected">Connected - Discussed</SelectItem>
                    <SelectItem value="interested">Interested - Will Visit</SelectItem>
                    <SelectItem value="callback">Call Back Later</SelectItem>
                    <SelectItem value="not-interested">Not Interested</SelectItem>
                    <SelectItem value="wrong-number">Wrong Number</SelectItem>
                    <SelectItem value="no-answer">No Answer</SelectItem>
                    <SelectItem value="voicemail">Voicemail Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sentiment */}
              <div>
                <Label>Lead Sentiment</Label>
                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sentiment: "positive" })}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      formData.sentiment === "positive"
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <ThumbsUp className={`w-6 h-6 mx-auto mb-2 ${
                      formData.sentiment === "positive" ? "text-emerald-600" : "text-slate-400"
                    }`} />
                    <p className="text-sm font-medium">Positive</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sentiment: "neutral" })}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      formData.sentiment === "neutral"
                        ? "border-amber-500 bg-amber-50"
                        : "border-slate-200 hover:border-amber-300"
                    }`}
                  >
                    <Minus className={`w-6 h-6 mx-auto mb-2 ${
                      formData.sentiment === "neutral" ? "text-amber-600" : "text-slate-400"
                    }`} />
                    <p className="text-sm font-medium">Neutral</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, sentiment: "negative" })}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                      formData.sentiment === "negative"
                        ? "border-red-500 bg-red-50"
                        : "border-slate-200 hover:border-red-300"
                    }`}
                  >
                    <ThumbsDown className={`w-6 h-6 mx-auto mb-2 ${
                      formData.sentiment === "negative" ? "text-red-600" : "text-slate-400"
                    }`} />
                    <p className="text-sm font-medium">Negative</p>
                  </button>
                </div>
              </div>

              {/* Next Action */}
              <div>
                <Label htmlFor="nextAction">Next Action</Label>
                <Select
                  value={formData.nextAction}
                  onValueChange={(value) => setFormData({ ...formData, nextAction: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select next step" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="schedule-visit">Schedule Site Visit</SelectItem>
                    <SelectItem value="send-brochure">Send Property Brochure</SelectItem>
                    <SelectItem value="follow-up">Follow Up in 2-3 Days</SelectItem>
                    <SelectItem value="send-payment-plan">Send Payment Plan</SelectItem>
                    <SelectItem value="escalate">Escalate to Manager</SelectItem>
                    <SelectItem value="none">No Action Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Call Duration */}
              <div>
                <Label htmlFor="duration">Call Duration</Label>
                <Select
                  value={formData.callDuration}
                  onValueChange={(value) => setFormData({ ...formData, callDuration: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-1min">Less than 1 minute</SelectItem>
                    <SelectItem value="1-3min">1-3 minutes</SelectItem>
                    <SelectItem value="3-5min">3-5 minutes</SelectItem>
                    <SelectItem value="5-10min">5-10 minutes</SelectItem>
                    <SelectItem value="10plus">More than 10 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Call Notes */}
              <div>
                <Label htmlFor="notes">Call Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add detailed notes about the conversation..."
                  rows={5}
                />
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setCallStatus("not-started");
                setFormData({
                  outcome: "",
                  callDuration: "",
                  nextAction: "",
                  notes: "",
                  sentiment: ""
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            {(callStatus === "in-progress" || callStatus === "completed") && (
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Call Log
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
