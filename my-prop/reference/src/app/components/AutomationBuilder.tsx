import { useState } from "react";
import {
  Plus,
  Play,
  ArrowRight,
  Clock,
  MessageSquare,
  Mail,
  Users,
  Circle,
  Trash2,
  Edit,
  Gift,
  Bell,
  Phone,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Star,
  Target,
  Zap,
  Filter,
  Database,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

type StepType =
  | "trigger"
  | "whatsapp"
  | "email"
  | "sms"
  | "wait"
  | "condition"
  | "assign"
  | "tag"
  | "score"
  | "notification"
  | "webhook";

interface AutomationStep {
  id: string;
  type: StepType;
  name: string;
  description: string;
  config: {
    message?: string;
    delay?: string;
    delayUnit?: "minutes" | "hours" | "days";
    condition?: string;
    assignTo?: string;
    tagName?: string;
    scoreValue?: number;
    webhookUrl?: string;
    subject?: string;
  };
}

const stepTemplates: Record<StepType, { name: string; icon: any; color: string; bgColor: string }> = {
  trigger: { name: "Trigger", icon: Zap, color: "text-emerald-600", bgColor: "bg-emerald-100" },
  whatsapp: { name: "WhatsApp Message", icon: MessageSquare, color: "text-green-600", bgColor: "bg-green-100" },
  email: { name: "Email", icon: Mail, color: "text-blue-600", bgColor: "bg-blue-100" },
  sms: { name: "SMS", icon: Phone, color: "text-purple-600", bgColor: "bg-purple-100" },
  wait: { name: "Wait/Delay", icon: Clock, color: "text-amber-600", bgColor: "bg-amber-100" },
  condition: { name: "Condition", icon: Filter, color: "text-purple-600", bgColor: "bg-purple-100" },
  assign: { name: "Assign to Agent", icon: Users, color: "text-blue-600", bgColor: "bg-blue-100" },
  tag: { name: "Add Tag", icon: Tag, color: "text-pink-600", bgColor: "bg-pink-100" },
  score: { name: "Update Score", icon: Star, color: "text-yellow-600", bgColor: "bg-yellow-100" },
  notification: { name: "Send Notification", icon: Bell, color: "text-red-600", bgColor: "bg-red-100" },
  webhook: { name: "Webhook", icon: Database, color: "text-slate-600", bgColor: "bg-slate-100" },
};

export function AutomationBuilder() {
  const [steps, setSteps] = useState<AutomationStep[]>([
    {
      id: "1",
      type: "trigger",
      name: "Trigger",
      description: "When a new lead is captured",
      config: {},
    },
  ]);
  const [showAddStep, setShowAddStep] = useState(false);
  const [showEditStep, setShowEditStep] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number | null>(null);
  const [newStepType, setNewStepType] = useState<StepType>("whatsapp");
  const [editingStep, setEditingStep] = useState<AutomationStep | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [stepToDelete, setStepToDelete] = useState<number | null>(null);
  const [automationName, setAutomationName] = useState("New Automation");

  const handleAddStep = () => {
    const template = stepTemplates[newStepType];
    const newStep: AutomationStep = {
      id: Date.now().toString(),
      type: newStepType,
      name: template.name,
      description: `New ${template.name}`,
      config: {},
    };
    setSteps([...steps, newStep]);
    setShowAddStep(false);
    toast.success("Step added successfully");
  };

  const handleEditStep = (index: number) => {
    setSelectedStepIndex(index);
    setEditingStep({ ...steps[index] });
    setShowEditStep(true);
  };

  const handleSaveEdit = () => {
    if (selectedStepIndex !== null && editingStep) {
      const updatedSteps = [...steps];
      updatedSteps[selectedStepIndex] = editingStep;
      setSteps(updatedSteps);
      setShowEditStep(false);
      toast.success("Step updated successfully");
    }
  };

  const handleDeleteStep = (index: number) => {
    setStepToDelete(index);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (stepToDelete !== null) {
      setSteps(steps.filter((_, i) => i !== stepToDelete));
      setShowDeleteDialog(false);
      setStepToDelete(null);
      toast.success("Step deleted successfully");
    }
  };

  const handleSaveAutomation = () => {
    toast.success("Automation saved successfully!");
    // In a real app, this would save to backend
  };

  const renderStepConfig = () => {
    if (!editingStep) return null;

    switch (editingStep.type) {
      case "trigger":
        return (
          <div className="space-y-4">
            <div>
              <Label>Trigger Event</Label>
              <Select
                value={editingStep.config.condition || "new_lead"}
                onValueChange={(value) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, condition: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_lead">New Lead Captured</SelectItem>
                  <SelectItem value="form_submit">Form Submitted</SelectItem>
                  <SelectItem value="website_visit">Website Visit</SelectItem>
                  <SelectItem value="lead_stage">Lead Stage Changed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={editingStep.description}
                onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
              />
            </div>
          </div>
        );

      case "whatsapp":
      case "sms":
        return (
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editingStep.name}
                onChange={(e) => setEditingStep({ ...editingStep, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={editingStep.config.message || ""}
                onChange={(e) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, message: e.target.value } })
                }
                placeholder="Enter your message here..."
                rows={5}
              />
              <p className="text-xs text-slate-500 mt-1">
                Use variables: {"{name}"}, {"{project}"}, {"{agent}"}
              </p>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={editingStep.name}
                onChange={(e) => setEditingStep({ ...editingStep, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={editingStep.config.subject || ""}
                onChange={(e) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, subject: e.target.value } })
                }
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                value={editingStep.config.message || ""}
                onChange={(e) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, message: e.target.value } })
                }
                placeholder="Enter email body..."
                rows={6}
              />
            </div>
          </div>
        );

      case "wait":
        return (
          <div className="space-y-4">
            <div>
              <Label>Delay Duration</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={editingStep.config.delay || "1"}
                  onChange={(e) =>
                    setEditingStep({ ...editingStep, config: { ...editingStep.config, delay: e.target.value } })
                  }
                  className="flex-1"
                />
                <Select
                  value={editingStep.config.delayUnit || "hours"}
                  onValueChange={(value: any) =>
                    setEditingStep({ ...editingStep, config: { ...editingStep.config, delayUnit: value } })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={editingStep.description}
                onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
              />
            </div>
          </div>
        );

      case "condition":
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition Type</Label>
              <Select
                value={editingStep.config.condition || "replied"}
                onValueChange={(value) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, condition: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="replied">Lead Replied</SelectItem>
                  <SelectItem value="not_replied">Lead Not Replied</SelectItem>
                  <SelectItem value="opened">Message Opened</SelectItem>
                  <SelectItem value="clicked">Link Clicked</SelectItem>
                  <SelectItem value="score">Lead Score &gt; X</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={editingStep.description}
                onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
              />
            </div>
          </div>
        );

      case "assign":
        return (
          <div className="space-y-4">
            <div>
              <Label>Assign To</Label>
              <Select
                value={editingStep.config.assignTo || "round_robin"}
                onValueChange={(value) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, assignTo: value } })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="round_robin">Next Available (Round Robin)</SelectItem>
                  <SelectItem value="least_busy">Least Busy Agent</SelectItem>
                  <SelectItem value="specific">Specific Agent</SelectItem>
                  <SelectItem value="team">Specific Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "tag":
        return (
          <div className="space-y-4">
            <div>
              <Label>Tag Name</Label>
              <Input
                value={editingStep.config.tagName || ""}
                onChange={(e) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, tagName: e.target.value } })
                }
                placeholder="e.g., Hot Lead, Interested, Follow-up"
              />
            </div>
          </div>
        );

      case "score":
        return (
          <div className="space-y-4">
            <div>
              <Label>Score Change</Label>
              <Input
                type="number"
                value={editingStep.config.scoreValue || "10"}
                onChange={(e) =>
                  setEditingStep({
                    ...editingStep,
                    config: { ...editingStep.config, scoreValue: parseInt(e.target.value) },
                  })
                }
                placeholder="e.g., +10, -5"
              />
              <p className="text-xs text-slate-500 mt-1">Positive values increase score, negative decrease</p>
            </div>
          </div>
        );

      case "webhook":
        return (
          <div className="space-y-4">
            <div>
              <Label>Webhook URL</Label>
              <Input
                value={editingStep.config.webhookUrl || ""}
                onChange={(e) =>
                  setEditingStep({ ...editingStep, config: { ...editingStep.config, webhookUrl: e.target.value } })
                }
                placeholder="https://your-webhook-url.com/endpoint"
              />
            </div>
          </div>
        );

      default:
        return (
          <div>
            <Label>Description</Label>
            <Input
              value={editingStep.description}
              onChange={(e) => setEditingStep({ ...editingStep, description: e.target.value })}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Input
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                className="text-xl font-bold border-0 px-0 focus-visible:ring-0"
              />
              <p className="text-sm text-slate-600 mt-1">
                {steps.length} step{steps.length !== 1 ? "s" : ""} configured
              </p>
            </div>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
              onClick={handleSaveAutomation}
            >
              Save Automation
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Automation Flow */}
      <Card>
        <CardContent className="pt-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto pb-6">
              {steps.map((step, index) => {
                const template = stepTemplates[step.type];
                const Icon = template.icon;

                return (
                  <div key={step.id} className="w-full">
                    {/* Step Card */}
                    <div
                      className={`bg-white border-2 border-slate-200 p-6 rounded-xl shadow-md hover:border-emerald-300 cursor-pointer transition-all ${
                        step.type === "trigger" ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              step.type === "trigger" ? "bg-white/20" : template.bgColor
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${step.type === "trigger" ? "text-white" : template.color}`}
                            />
                          </div>
                          <div className="flex-1">
                            <h3
                              className={`font-bold text-base mb-1 ${
                                step.type === "trigger" ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {step.name}
                            </h3>
                            <p
                              className={`text-sm ${
                                step.type === "trigger" ? "text-emerald-50" : "text-slate-600"
                              }`}
                            >
                              {step.description}
                            </p>

                            {/* Config Display */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {step.config.delay && (
                                <Badge variant="outline" className={step.type === "trigger" ? "border-white/30 text-white" : ""}>
                                  Delay: {step.config.delay} {step.config.delayUnit}
                                </Badge>
                              )}
                              {step.config.condition && (
                                <Badge variant="outline" className={step.type === "trigger" ? "border-white/30 text-white" : ""}>
                                  {step.config.condition}
                                </Badge>
                              )}
                              {step.config.tagName && (
                                <Badge variant="outline" className={step.type === "trigger" ? "border-white/30 text-white" : ""}>
                                  Tag: {step.config.tagName}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {step.type !== "trigger" && (
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditStep(index)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteStep(index)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-center py-3">
                        <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Add Step Button */}
              <Button
                variant="outline"
                className="mt-4 border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
                onClick={() => setShowAddStep(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Add Step Dialog */}
      <Dialog open={showAddStep} onOpenChange={setShowAddStep}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Automation Step</DialogTitle>
            <DialogDescription>Choose the type of step you want to add to your automation</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            {(Object.entries(stepTemplates) as [StepType, typeof stepTemplates[StepType]][])
              .filter(([type]) => type !== "trigger")
              .map(([type, template]) => {
                const Icon = template.icon;
                return (
                  <button
                    key={type}
                    onClick={() => setNewStepType(type)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      newStepType === type
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 hover:border-emerald-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${template.bgColor}`}>
                        <Icon className={`w-5 h-5 ${template.color}`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{template.name}</h4>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddStep(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleAddStep}
            >
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Step Dialog */}
      <Dialog open={showEditStep} onOpenChange={setShowEditStep}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Step</DialogTitle>
            <DialogDescription>Configure the step settings</DialogDescription>
          </DialogHeader>

          <div className="py-4">{renderStepConfig()}</div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditStep(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Step</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this step? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
