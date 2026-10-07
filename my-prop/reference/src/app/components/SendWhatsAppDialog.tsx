import { useState } from "react";
import { MessageSquare, Send, Sparkles } from "lucide-react";
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
import { Badge } from "./ui/badge";

interface SendWhatsAppDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
}

const messageTemplates = [
  {
    id: 1,
    name: "Site Visit Invitation",
    message: "Hi {name}, thank you for your interest in {project}. We'd love to show you around! Are you available for a site visit this weekend? Our team can arrange a personalized tour."
  },
  {
    id: 2,
    name: "Follow Up",
    message: "Hi {name}, I wanted to follow up on your inquiry about {project}. Do you have any questions? I'm here to help you find your dream home!"
  },
  {
    id: 3,
    name: "Special Offer",
    message: "Hi {name}, we have an exclusive limited-time offer on {project}! Book now and get special pricing. Would you like to schedule a call to discuss?"
  },
  {
    id: 4,
    name: "Payment Plan Info",
    message: "Hi {name}, we offer flexible payment plans for {project} that can fit your budget of {budget}. Shall I share the detailed payment structure with you?"
  }
];

export function SendWhatsAppDialog({ open, onOpenChange, lead }: SendWhatsAppDialogProps) {
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);

  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    const personalizedMessage = template.message
      .replace("{name}", lead?.name?.split(" ")[0] || "")
      .replace("{project}", lead?.project || "")
      .replace("{budget}", lead?.budget || "");
    
    setMessage(personalizedMessage);
    setSelectedTemplate(template.id);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    // In a real app, this would send the message via WhatsApp API
    console.log("Sending WhatsApp message:", {
      to: lead?.phone,
      message: message
    });
    
    // Show success notification
    alert("WhatsApp message sent successfully!");
    onOpenChange(false);
    setMessage("");
    setSelectedTemplate(null);
  };

  const handleGenerateAI = () => {
    // In a real app, this would call an AI service to generate a personalized message
    const aiMessage = `Hi ${lead?.name?.split(" ")[0]}, I noticed you're interested in ${lead?.project} with a budget of ${lead?.budget}. I'd love to help you find the perfect property that matches your requirements. When would be a good time for us to discuss this further?`;
    setMessage(aiMessage);
    setSelectedTemplate(null);
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-600" />
            Send WhatsApp Message
          </DialogTitle>
          <DialogDescription>
            Send a message to {lead.name} at {lead.phone}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Message Templates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Quick Templates
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateAI}
                className="gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                AI Generate
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {messageTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 border-2 rounded-lg text-left hover:border-emerald-300 transition-all ${
                    selectedTemplate === template.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <p className="font-medium text-sm text-slate-900">{template.name}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {template.message.substring(0, 60)}...
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Message Composer */}
          <div className="space-y-3">
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              className="resize-none"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{message.length} characters</span>
              {message.length > 0 && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                  Ready to send
                </Badge>
              )}
            </div>
          </div>

          {/* Preview */}
          {message && (
            <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border-2 border-emerald-200">
              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Preview</p>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{message}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setMessage("");
                setSelectedTemplate(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send via WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
