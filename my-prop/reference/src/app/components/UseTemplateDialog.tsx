import { useState } from "react";
import {
  Sparkles,
  Check,
  ArrowRight,
  Globe,
  FileText,
  Settings,
  Rocket
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router";

interface Template {
  id: number;
  name: string;
  category: string;
  thumbnail: string;
  rating: number;
  uses: number;
  isPremium: boolean;
  description: string;
}

interface UseTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

export function UseTemplateDialog({
  open,
  onOpenChange,
  template
}: UseTemplateDialogProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    websiteName: "",
    projectName: "",
    domain: "",
  });

  if (!template) return null;

  const handleCreate = () => {
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      onOpenChange(false);
      // Navigate to website builder with a new website ID
      navigate("/app/websites/new/builder");
      // Reset for next time
      setStep(1);
      setFormData({ websiteName: "", projectName: "", domain: "" });
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Create Website from Template
          </DialogTitle>
          <DialogDescription>
            Set up your new website using the {template.name} template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Preview */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={`https://images.unsplash.com/${template.thumbnail}?w=200&h=200&fit=crop`}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900">{template.name}</h3>
                  {template.isPremium && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600">{template.description}</p>
                <Badge variant="secondary" className="text-xs mt-2">
                  {template.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    step >= s
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 2 && (
                  <div
                    className={`w-12 h-0.5 mx-2 ${
                      step > s ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="websiteName">Website Name *</Label>
                <Input
                  id="websiteName"
                  placeholder="e.g., Skyline Heights Official Site"
                  value={formData.websiteName}
                  onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">This will appear in the browser tab</p>
              </div>

              <div>
                <Label htmlFor="projectName">Project/Property Name *</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Skyline Heights"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">Your property or project name</p>
              </div>

              <div className="pt-4">
                <h4 className="font-medium text-slate-900 mb-3">What happens next?</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Template Applied</p>
                      <p className="text-xs text-slate-600">
                        The {template.name} template will be set up with your branding
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Customize Content</p>
                      <p className="text-xs text-slate-600">
                        Edit text, images, and sections in the visual builder
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Configure Settings</p>
                      <p className="text-xs text-slate-600">
                        Set up domain, SEO, analytics, and integrations
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Rocket className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Go Live</p>
                      <p className="text-xs text-slate-600">
                        Publish your website and start generating leads
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Domain Setup */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Choose Your Domain (Optional)</Label>
                <div className="mt-1 flex gap-2">
                  <Input
                    id="domain"
                    placeholder="your-property"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  />
                  <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 flex items-center text-sm text-slate-600 whitespace-nowrap">
                    .myprop.live
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  You can also use a custom domain later in settings
                </p>
              </div>

              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-emerald-900 text-sm mb-1">Free subdomain included</p>
                    <p className="text-xs text-emerald-700">
                      Your website will be accessible at{" "}
                      <span className="font-mono font-medium">
                        {formData.domain || "your-property"}.myprop.live
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-900 mb-3 text-sm">Included Features:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "SSL Certificate",
                    "CDN Hosting",
                    "Mobile Responsive",
                    "SEO Optimized",
                    "Analytics Tracking",
                    "Contact Forms",
                    "WhatsApp Integration",
                    "Lead Management",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span className="text-xs text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {step === 1 ? (
              <>
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.websiteName || !formData.projectName}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={creating}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600"
                >
                  {creating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Creating Website...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Create Website
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}