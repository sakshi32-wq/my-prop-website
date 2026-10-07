import { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Home,
  Palette,
  Layout,
  Image as ImageIcon,
  MessageSquare,
  Globe,
  Download,
  Eye
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

interface GenerateTemplateWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, name: "Template Type", icon: Home },
  { id: 2, name: "Design Style", icon: Palette },
  { id: 3, name: "Layout & Sections", icon: Layout },
  { id: 4, name: "Content & Features", icon: MessageSquare },
  { id: 5, name: "Generate & Preview", icon: Sparkles },
];

export function GenerateTemplateWizard({ open, onOpenChange }: GenerateTemplateWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [formData, setFormData] = useState({
    templateType: "",
    propertyType: "",
    targetAudience: "",
    designStyle: "",
    colorScheme: "",
    layoutStyle: "",
    sections: [] as string[],
    heroStyle: "",
    includeFeatures: [] as string[],
    templateName: "",
    templateDescription: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 3000);
  };

  const toggleSection = (section: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...prev.sections, section]
    }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      includeFeatures: prev.includeFeatures.includes(feature)
        ? prev.includeFeatures.filter(f => f !== feature)
        : [...prev.includeFeatures, feature]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.templateType && formData.propertyType && formData.targetAudience;
      case 2:
        return formData.designStyle && formData.colorScheme;
      case 3:
        return formData.layoutStyle && formData.sections.length > 0;
      case 4:
        return formData.heroStyle && formData.includeFeatures.length > 0;
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Generate Custom Template with AI
          </DialogTitle>
          <DialogDescription>
            Create a personalized website template powered by AI
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep > step.id
                        ? "bg-emerald-600"
                        : currentStep === step.id
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600"
                        : "bg-slate-200"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon
                        className={`w-5 h-5 ${
                          currentStep >= step.id ? "text-white" : "text-slate-400"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center ${
                      currentStep >= step.id ? "text-slate-900 font-medium" : "text-slate-400"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 -mt-6 transition-all ${
                      currentStep > step.id ? "bg-emerald-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="py-6 space-y-6">
          {/* Step 1: Template Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Template Type & Purpose</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="templateType">What type of template do you need?</Label>
                    <Select
                      value={formData.templateType}
                      onValueChange={(value) => setFormData({ ...formData, templateType: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single-property">Single Property Showcase</SelectItem>
                        <SelectItem value="multi-property">Multi-Property Listing</SelectItem>
                        <SelectItem value="builder-portfolio">Builder/Developer Portfolio</SelectItem>
                        <SelectItem value="broker-profile">Broker Profile & Listings</SelectItem>
                        <SelectItem value="project-launch">New Project Launch</SelectItem>
                        <SelectItem value="landing-page">Lead Generation Landing Page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="propertyType">Primary Property Type</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury-apartments">Luxury Apartments</SelectItem>
                        <SelectItem value="villas">Villas & Independent Houses</SelectItem>
                        <SelectItem value="commercial">Commercial Properties</SelectItem>
                        <SelectItem value="affordable-housing">Affordable Housing</SelectItem>
                        <SelectItem value="plots">Plots & Land</SelectItem>
                        <SelectItem value="penthouses">Penthouses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Select
                      value={formData.targetAudience}
                      onValueChange={(value) => setFormData({ ...formData, targetAudience: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury-buyers">Luxury Home Buyers</SelectItem>
                        <SelectItem value="first-time">First-time Home Buyers</SelectItem>
                        <SelectItem value="investors">Property Investors</SelectItem>
                        <SelectItem value="families">Growing Families</SelectItem>
                        <SelectItem value="professionals">Working Professionals</SelectItem>
                        <SelectItem value="nri">NRI Buyers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Design Style */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Design Style & Colors</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Design Style</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {[
                        { value: "luxury", label: "Luxury & Premium", desc: "Elegant, sophisticated" },
                        { value: "modern", label: "Modern & Minimal", desc: "Clean, contemporary" },
                        { value: "warm", label: "Warm & Inviting", desc: "Cozy, welcoming" },
                        { value: "bold", label: "Bold & Vibrant", desc: "Eye-catching, energetic" },
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setFormData({ ...formData, designStyle: style.value })}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.designStyle === style.value
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="font-bold text-slate-900">{style.label}</div>
                          <div className="text-sm text-slate-600">{style.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Color Scheme</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[
                        { value: "blue-gold", label: "Blue & Gold", colors: ["bg-blue-600", "bg-amber-500"] },
                        { value: "emerald-teal", label: "Emerald & Teal", colors: ["bg-emerald-600", "bg-teal-600"] },
                        { value: "purple-pink", label: "Purple & Pink", colors: ["bg-purple-600", "bg-pink-500"] },
                        { value: "dark-elegant", label: "Dark & Elegant", colors: ["bg-slate-800", "bg-amber-600"] },
                        { value: "earth-tones", label: "Earth Tones", colors: ["bg-amber-700", "bg-green-700"] },
                        { value: "monochrome", label: "Monochrome", colors: ["bg-slate-900", "bg-slate-400"] },
                      ].map((scheme) => (
                        <button
                          key={scheme.value}
                          onClick={() => setFormData({ ...formData, colorScheme: scheme.value })}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            formData.colorScheme === scheme.value
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex gap-2 mb-2">
                            {scheme.colors.map((color, i) => (
                              <div key={i} className={`w-8 h-8 rounded ${color}`} />
                            ))}
                          </div>
                          <div className="text-xs font-medium text-slate-900">{scheme.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Layout & Sections */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Layout & Sections</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Layout Style</Label>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[
                        { value: "single-page", label: "Single Page", desc: "All-in-one scrolling" },
                        { value: "multi-page", label: "Multi Page", desc: "Separate pages" },
                        { value: "hybrid", label: "Hybrid", desc: "Best of both" },
                      ].map((layout) => (
                        <button
                          key={layout.value}
                          onClick={() => setFormData({ ...formData, layoutStyle: layout.value })}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.layoutStyle === layout.value
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="font-bold text-slate-900 mb-1">{layout.label}</div>
                          <div className="text-xs text-slate-600">{layout.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Select Sections to Include</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "Hero Banner",
                        "About/Overview",
                        "Floor Plans",
                        "Amenities",
                        "Location & Map",
                        "Gallery",
                        "Pricing",
                        "Virtual Tour",
                        "Testimonials",
                        "Contact Form",
                        "Site Visit Booking",
                        "FAQ Section",
                      ].map((section) => (
                        <button
                          key={section}
                          onClick={() => toggleSection(section)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            formData.sections.includes(section)
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                formData.sections.includes(section)
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-slate-300"
                              }`}
                            >
                              {formData.sections.includes(section) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-900">{section}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Content & Features */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">Content & Features</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label>Hero Section Style</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {[
                        { value: "fullscreen-video", label: "Fullscreen Video", desc: "Immersive video background" },
                        { value: "image-slider", label: "Image Slider", desc: "Multiple property images" },
                        { value: "split-screen", label: "Split Screen", desc: "Content + Image split" },
                        { value: "minimalist", label: "Minimalist", desc: "Clean with CTA focus" },
                      ].map((hero) => (
                        <button
                          key={hero.value}
                          onClick={() => setFormData({ ...formData, heroStyle: hero.value })}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            formData.heroStyle === hero.value
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="font-bold text-slate-900 mb-1">{hero.label}</div>
                          <div className="text-xs text-slate-600">{hero.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Interactive Features</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        "AI Chatbot",
                        "WhatsApp Integration",
                        "Live Chat",
                        "Lead Capture Forms",
                        "Virtual Site Tour",
                        "EMI Calculator",
                        "Interactive Floor Plans",
                        "360° Gallery",
                      ].map((feature) => (
                        <button
                          key={feature}
                          onClick={() => toggleFeature(feature)}
                          className={`p-3 rounded-lg border-2 text-left transition-all ${
                            formData.includeFeatures.includes(feature)
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 hover:border-slate-300 bg-white"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                                formData.includeFeatures.includes(feature)
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-slate-300"
                              }`}
                            >
                              {formData.includeFeatures.includes(feature) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-900">{feature}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="templateName">Template Name</Label>
                      <Input
                        id="templateName"
                        placeholder="e.g., Modern Luxury Template"
                        value={formData.templateName}
                        onChange={(e) => setFormData({ ...formData, templateName: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="templateDescription">Short Description</Label>
                      <Input
                        id="templateDescription"
                        placeholder="Brief description"
                        value={formData.templateDescription}
                        onChange={(e) => setFormData({ ...formData, templateDescription: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Generate & Preview */}
          {currentStep === 5 && (
            <div className="space-y-6">
              {!generated ? (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Generate!</h3>
                    <p className="text-slate-600 mb-6">
                      Review your selections and generate your custom template
                    </p>
                  </div>

                  {/* Summary */}
                  <Card className="border-2 border-slate-200">
                    <CardContent className="p-6 text-left">
                      <h4 className="font-bold text-slate-900 mb-4">Template Summary</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Template Type:</span>
                          <p className="font-medium text-slate-900 capitalize">{formData.templateType?.replace(/-/g, ' ')}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Property Type:</span>
                          <p className="font-medium text-slate-900 capitalize">{formData.propertyType?.replace(/-/g, ' ')}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Design Style:</span>
                          <p className="font-medium text-slate-900 capitalize">{formData.designStyle}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Layout:</span>
                          <p className="font-medium text-slate-900 capitalize">{formData.layoutStyle?.replace(/-/g, ' ')}</p>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-600">Sections ({formData.sections.length}):</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.sections.map((section) => (
                              <Badge key={section} variant="secondary" className="text-xs">
                                {section}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-slate-600">Features ({formData.includeFeatures.length}):</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {formData.includeFeatures.map((feature) => (
                              <Badge key={feature} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                    size="lg"
                  >
                    {generating ? (
                      <>
                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                        Generating Template...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Template
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center pb-4 border-b border-slate-200">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Template Generated!</h3>
                    <p className="text-slate-600">Your custom template is ready to use</p>
                  </div>

                  {/* Preview */}
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg border-2 border-slate-300 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10" />
                    <div className="text-center z-10">
                      <Globe className="w-16 h-16 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 font-medium">
                        {formData.templateName || "Custom Template"} Preview
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="lg">
                      <Eye className="w-5 h-5 mr-2" />
                      Full Preview
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      size="lg"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Use Template
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Save to Library
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Share Template
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-slate-600">
              Step {currentStep} of {steps.length}
            </div>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {currentStep === 5 && !generated && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-slate-600">
              Final Step
            </div>
            <div className="w-20" /> {/* Spacer for alignment */}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
