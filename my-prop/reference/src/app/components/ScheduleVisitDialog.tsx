import { useState } from "react";
import { Calendar, Clock, MapPin, Save, User } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
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

interface ScheduleVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
}

export function ScheduleVisitDialog({ open, onOpenChange, lead }: ScheduleVisitDialogProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    project: lead?.project || "",
    assignedTo: "",
    notes: "",
    reminderBefore: "1hour"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would create a calendar event and send notifications
    console.log("Scheduling site visit:", {
      lead: lead,
      ...formData
    });
    
    alert(`Site visit scheduled for ${lead?.name} on ${formData.date} at ${formData.time}`);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      date: "",
      time: "",
      project: lead?.project || "",
      assignedTo: "",
      notes: "",
      reminderBefore: "1hour"
    });
  };

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Schedule Site Visit
          </DialogTitle>
          <DialogDescription>
            Schedule a property tour for {lead.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Lead Information */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-700">
                  {lead.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{lead.name}</h4>
                <p className="text-sm text-slate-600">{lead.phone}</p>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Visit Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="time">Visit Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Project Selection */}
          <div>
            <Label htmlFor="project">Property/Project *</Label>
            <Select
              value={formData.project}
              onValueChange={(value) => setFormData({ ...formData, project: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Skyline Heights">Skyline Heights</SelectItem>
                <SelectItem value="Marina Bay">Marina Bay</SelectItem>
                <SelectItem value="Green Valley">Green Valley</SelectItem>
                <SelectItem value="Ocean View Residency">Ocean View Residency</SelectItem>
                <SelectItem value="Royal Gardens">Royal Gardens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <div>
            <Label htmlFor="assignedTo">Assign To Sales Rep</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Amit Sharma">Amit Sharma (Senior Sales)</SelectItem>
                <SelectItem value="Priya Singh">Priya Singh (Sales Manager)</SelectItem>
                <SelectItem value="Rajesh Kumar">Rajesh Kumar (Sales Executive)</SelectItem>
                <SelectItem value="Neha Patel">Neha Patel (Sales Associate)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reminder */}
          <div>
            <Label htmlFor="reminder">Send Reminder</Label>
            <Select
              value={formData.reminderBefore}
              onValueChange={(value) => setFormData({ ...formData, reminderBefore: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">15 minutes before</SelectItem>
                <SelectItem value="30min">30 minutes before</SelectItem>
                <SelectItem value="1hour">1 hour before</SelectItem>
                <SelectItem value="2hours">2 hours before</SelectItem>
                <SelectItem value="1day">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any special instructions or requirements..."
              rows={4}
            />
          </div>

          {/* Visit Checklist */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Visit Preparation Checklist
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Confirm availability with the lead 1 day before</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Prepare property brochures and pricing details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Share location and directions via WhatsApp</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Arrange for site manager to be present</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Schedule Visit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
