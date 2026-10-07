import { useState } from "react";
import {
  X,
  Eye,
  Download,
  Share2,
  Star,
  Check,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

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

interface TemplatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
  onUseTemplate: (template: Template) => void;
}

export function TemplatePreviewDialog({
  open,
  onOpenChange,
  template,
  onUseTemplate
}: TemplatePreviewDialogProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [activeSection, setActiveSection] = useState("hero");

  if (!template) return null;

  const sections = [
    { id: "hero", name: "Hero Section" },
    { id: "about", name: "About" },
    { id: "features", name: "Features" },
    { id: "gallery", name: "Gallery" },
    { id: "contact", name: "Contact" },
  ];

  const features = [
    "Responsive Design",
    "SEO Optimized",
    "Fast Loading",
    "Mobile First",
    "Contact Forms",
    "Social Integration",
    "Analytics Ready",
    "Cross-Browser Compatible",
  ];

  const getViewModeWidth = () => {
    switch (viewMode) {
      case "mobile":
        return "w-[375px]";
      case "tablet":
        return "w-[768px]";
      default:
        return "w-full";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] max-h-[95vh] p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-slate-200">
          <DialogDescription className="sr-only">
            Preview {template.name} template with responsive view options and detailed sections
          </DialogDescription>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-xl">{template.name}</DialogTitle>
              {template.isPremium && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
              <Badge variant="secondary">{template.category}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "desktop"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Desktop View"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("tablet")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "tablet"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`p-2 rounded transition-all ${
                    viewMode === "mobile"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                onClick={() => onUseTemplate(template)}
              >
                <Check className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-[calc(95vh-80px)]">
          {/* Left Sidebar - Template Info */}
          <div className="w-80 border-r border-slate-200 overflow-y-auto bg-slate-50">
            <div className="p-6 space-y-6">
              {/* Template Stats */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Template Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-medium text-slate-900">{template.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Used by</span>
                    <span className="font-medium text-slate-900">
                      {template.uses.toLocaleString()} users
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Category</span>
                    <span className="font-medium text-slate-900">{template.category}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {template.description}. This professionally designed template includes all essential
                  sections and features to create a stunning property website that converts visitors into leads.
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Key Features</h3>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div>
                <h3 className="font-bold text-slate-900 mb-3">Template Sections</h3>
                <div className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                        activeSection === section.id
                          ? "bg-emerald-100 text-emerald-900 font-medium"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <Button
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  onClick={() => onUseTemplate(template)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Use This Template
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Preview
                </Button>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Preview Area */}
          <div className="flex-1 overflow-hidden bg-slate-100">
            <div className="h-full overflow-y-auto flex justify-center p-8">
              <div className={`transition-all duration-300 ${getViewModeWidth()}`}>
                <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200">
                  {/* Mock Browser Chrome */}
                  <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-slate-700 rounded px-3 py-1 text-xs text-slate-300">
                        https://example.myprop.live
                      </div>
                    </div>
                  </div>

                  {/* Template Preview Content */}
                  <div className="overflow-y-auto">
                    {/* Hero Section */}
                    {activeSection === "hero" && (
                      <div className="relative h-96 bg-gradient-to-br from-slate-900 to-slate-700">
                        <img
                          src={`https://images.unsplash.com/${template.thumbnail}?w=1200&h=600&fit=crop`}
                          alt={template.name}
                          className="w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
                          <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                              {template.name}
                            </h1>
                            <p className="text-xl text-white/90 mb-6">
                              {template.description}
                            </p>
                            <div className="flex gap-3 justify-center">
                              <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium">
                                Schedule Visit
                              </div>
                              <div className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium border border-white/30">
                                Learn More
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* About Section */}
                    {activeSection === "about" && (
                      <div className="p-12 bg-white">
                        <div className="max-w-3xl mx-auto">
                          <h2 className="text-3xl font-bold text-slate-900 mb-6">About This Project</h2>
                          <div className="grid md:grid-cols-2 gap-8">
                            <div>
                              <p className="text-slate-700 leading-relaxed mb-4">
                                Experience luxury living at its finest with this premium development. 
                                Thoughtfully designed spaces that blend modern architecture with timeless elegance.
                              </p>
                              <p className="text-slate-700 leading-relaxed">
                                Located in a prime area with excellent connectivity and surrounded by 
                                world-class amenities.
                              </p>
                            </div>
                            <div className="space-y-4">
                              {["Prime Location", "Modern Amenities", "Sustainable Design", "24/7 Security"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <Check className="w-5 h-5 text-emerald-600" />
                                  </div>
                                  <span className="font-medium text-slate-900">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Features Section */}
                    {activeSection === "features" && (
                      <div className="p-12 bg-slate-50">
                        <div className="max-w-4xl mx-auto">
                          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                            Premium Amenities
                          </h2>
                          <div className="grid md:grid-cols-3 gap-6">
                            {[
                              { icon: "🏊", title: "Swimming Pool", desc: "Olympic-size pool" },
                              { icon: "💪", title: "Fitness Center", desc: "State-of-the-art gym" },
                              { icon: "🌳", title: "Garden", desc: "Landscaped gardens" },
                              { icon: "🏢", title: "Club House", desc: "Modern club house" },
                              { icon: "🎮", title: "Kids Play Area", desc: "Safe play zone" },
                              { icon: "🅿️", title: "Parking", desc: "Ample parking space" },
                            ].map((feature, i) => (
                              <div key={i} className="bg-white p-6 rounded-lg border border-slate-200">
                                <div className="text-3xl mb-3">{feature.icon}</div>
                                <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                                <p className="text-sm text-slate-600">{feature.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Gallery Section */}
                    {activeSection === "gallery" && (
                      <div className="p-12 bg-white">
                        <div className="max-w-5xl mx-auto">
                          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Gallery</h2>
                          <div className="grid md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <div key={i} className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                                <img
                                  src={`https://images.unsplash.com/${template.thumbnail}?w=400&h=300&fit=crop&sig=${i}`}
                                  alt={`Gallery ${i}`}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Contact Section */}
                    {activeSection === "contact" && (
                      <div className="p-12 bg-gradient-to-br from-emerald-50 to-teal-50">
                        <div className="max-w-2xl mx-auto">
                          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
                            Get In Touch
                          </h2>
                          <div className="bg-white p-8 rounded-lg border border-emerald-200">
                            <div className="space-y-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                  <div className="px-4 py-2 border border-slate-300 rounded-lg bg-slate-50">
                                    Your name
                                  </div>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                  <div className="px-4 py-2 border border-slate-300 rounded-lg bg-slate-50">
                                    +91 XXXXXXXXXX
                                  </div>
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <div className="px-4 py-2 border border-slate-300 rounded-lg bg-slate-50">
                                  your@email.com
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                                <div className="px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 h-24">
                                  Your message here...
                                </div>
                              </div>
                              <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-medium text-center">
                                Send Message
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}