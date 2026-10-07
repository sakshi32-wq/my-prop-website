import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Building2,
  MapPin,
  Home,
  Ruler,
  Image as ImageIcon,
  LayoutTemplate,
  Wand2,
  Upload,
  File,
  FileText,
  X,
  Eye,
  Paperclip,
  Wrench,
  MessageSquare,
  Mail,
  Phone,
  BarChart2,
  Gift,
  Bell,
  Calculator,
  Video,
  Calendar,
  Zap
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface CreateWebsiteWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templates = [
  {
    id: 1,
    name: "Luxury Launch",
    thumbnail: "photo-1560518883-ce09059eeffa",
    description: "Perfect for high-end property launches"
  },
  {
    id: 2,
    name: "Modern Tower",
    thumbnail: "photo-1545324418-cc1a3fa10c00",
    description: "Ideal for contemporary apartments"
  },
  {
    id: 3,
    name: "Villa Showcase",
    thumbnail: "photo-1512917774080-9991f1c4c750",
    description: "Showcase luxury villas"
  },
];

const amenitiesList = [
  "Swimming Pool", "Gym", "Garden", "Parking", "24/7 Security",
  "Club House", "Kids Play Area", "Jogging Track", "Indoor Games",
  "Power Backup", "Elevator", "CCTV", "Intercom", "Fire Safety"
];

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

interface WebsiteTool {
  id: string;
  name: string;
  description: string;
  category: 'lead-generation' | 'engagement' | 'analytics' | 'utilities';
  icon: any;
  enabled: boolean;
  config?: any;
}

const websiteTools: WebsiteTool[] = [
  // Lead Generation Tools
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Allow visitors to contact you directly',
    category: 'lead-generation',
    icon: Mail,
    enabled: true,
  },
  {
    id: 'lead-capture',
    name: 'Lead Capture Form',
    description: 'Capture visitor information with custom forms',
    category: 'lead-generation',
    icon: MessageSquare,
    enabled: false,
  },
  {
    id: 'whatsapp-chat',
    name: 'WhatsApp Chat Widget',
    description: 'Enable WhatsApp chat for instant communication',
    category: 'engagement',
    icon: Phone,
    enabled: true,
  },
  {
    id: 'schedule-visit',
    name: 'Schedule Visit',
    description: 'Let visitors book property visits',
    category: 'lead-generation',
    icon: Calendar,
    enabled: false,
  },
  
  // Engagement Tools
  {
    id: 'live-chat',
    name: 'Live Chat',
    description: 'Real-time chat with visitors',
    category: 'engagement',
    icon: MessageSquare,
    enabled: false,
  },
  {
    id: 'email-popup',
    name: 'Email Popup',
    description: 'Collect emails with popup forms',
    category: 'lead-generation',
    icon: Mail,
    enabled: false,
  },
  {
    id: 'promotion-banner',
    name: 'Promotion Banner',
    description: 'Display special offers and announcements',
    category: 'engagement',
    icon: Gift,
    enabled: false,
  },
  {
    id: 'notifications',
    name: 'Push Notifications',
    description: 'Send updates to subscribed visitors',
    category: 'engagement',
    icon: Bell,
    enabled: false,
  },
  
  // Analytics & Tracking
  {
    id: 'google-analytics',
    name: 'Google Analytics',
    description: 'Track website traffic and behavior',
    category: 'analytics',
    icon: BarChart2,
    enabled: false,
  },
  {
    id: 'facebook-pixel',
    name: 'Facebook Pixel',
    description: 'Track conversions and retarget visitors',
    category: 'analytics',
    icon: BarChart2,
    enabled: false,
  },
  {
    id: 'call-tracking',
    name: 'Call Tracking',
    description: 'Track phone call conversions',
    category: 'analytics',
    icon: Phone,
    enabled: false,
  },
  
  // Utilities
  {
    id: 'virtual-tour',
    name: 'Virtual Tour',
    description: '360° property tours',
    category: 'utilities',
    icon: Video,
    enabled: false,
  },
  {
    id: 'emi-calculator',
    name: 'EMI Calculator',
    description: 'Help visitors calculate loan EMIs',
    category: 'utilities',
    icon: Calculator,
    enabled: false,
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    description: 'Calculate mortgage and affordability',
    category: 'utilities',
    icon: Calculator,
    enabled: false,
  },
];

export function CreateWebsiteWizard({ open, onOpenChange }: CreateWebsiteWizardProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedTools, setSelectedTools] = useState<WebsiteTool[]>(websiteTools);
  const [additionalContent, setAdditionalContent] = useState({
    keyHighlights: "",
    developerInfo: "",
    nearbyLocations: "",
    specialOffers: "",
    floorPlans: "",
  });
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    description: "",
    propertyType: "",
    configurations: [] as string[],
    priceRange: "",
    amenities: [] as string[],
    targetAudience: "",
    aiTone: "luxury",
    selectedTemplate: 1,
    generateWithAI: true
  });

  const totalSteps = 7;
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
    console.log("Creating website with data:", formData);
    onOpenChange(false);
    // Navigate to website builder
    navigate("/app/websites/new/builder");
  };

  const toggleConfiguration = (config: string) => {
    setFormData(prev => ({
      ...prev,
      configurations: prev.configurations.includes(config)
        ? prev.configurations.filter(c => c !== config)
        : [...prev.configurations, config]
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Create New Property Website
          </DialogTitle>
          <DialogDescription>
            Step {step} of {totalSteps}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span className={step >= 1 ? "text-emerald-600 font-medium" : ""}>Basic Info</span>
            <span className={step >= 2 ? "text-emerald-600 font-medium" : ""}>Property Type</span>
            <span className={step >= 3 ? "text-emerald-600 font-medium" : ""}>Amenities</span>
            <span className={step >= 4 ? "text-emerald-600 font-medium" : ""}>AI Settings</span>
            <span className={step >= 5 ? "text-emerald-600 font-medium" : ""}>Template</span>
            <span className={step >= 6 ? "text-emerald-600 font-medium" : ""}>Additional Content</span>
            <span className={step >= 7 ? "text-emerald-600 font-medium" : ""}>Website Tools</span>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Tell us about your project</h3>
              </div>
              <p className="text-sm text-slate-600">We'll use this information to create your website</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  placeholder="e.g., Skyline Heights"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Input
                    id="location"
                    placeholder="e.g., Andheri West, Mumbai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1 pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe your property project..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Property Type & Configuration */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
              <div className="flex items-center gap-3 mb-2">
                <Home className="w-6 h-6 text-teal-600" />
                <h3 className="text-lg font-bold text-slate-900">Property Details</h3>
              </div>
              <p className="text-sm text-slate-600">Select the type and configurations available</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment Complex</SelectItem>
                    <SelectItem value="villa">Villas / Independent Houses</SelectItem>
                    <SelectItem value="penthouse">Penthouses</SelectItem>
                    <SelectItem value="commercial">Commercial Space</SelectItem>
                    <SelectItem value="plot">Plots / Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Configurations Available *</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5 BHK", "Duplex"].map((config) => (
                    <button
                      key={config}
                      onClick={() => toggleConfiguration(config)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        formData.configurations.includes(config)
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 hover:border-slate-300 text-slate-700"
                      }`}
                    >
                      {formData.configurations.includes(config) && (
                        <Check className="w-4 h-4 inline mr-1" />
                      )}
                      {config}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="priceRange">Price Range</Label>
                <Input
                  id="priceRange"
                  placeholder="e.g., ₹80L - ₹1.5Cr"
                  value={formData.priceRange}
                  onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Amenities & Features */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-3 mb-2">
                <Ruler className="w-6 h-6 text-amber-600" />
                <h3 className="text-lg font-bold text-slate-900">Amenities & Features</h3>
              </div>
              <p className="text-sm text-slate-600">Select the amenities your project offers</p>
            </div>

            <div>
              <Label>Select Amenities</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`p-3 rounded-lg border-2 text-sm text-left transition-all ${
                      formData.amenities.includes(amenity)
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    {formData.amenities.includes(amenity) && (
                      <Check className="w-4 h-4 inline mr-2" />
                    )}
                    {amenity}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Selected: {formData.amenities.length} amenities
              </p>
            </div>
          </div>
        )}

        {/* Step 4: AI Content Settings */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-2">
                <Wand2 className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900">AI Content Generation</h3>
              </div>
              <p className="text-sm text-slate-600">Customize how AI generates your website content</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">Generate content with AI</p>
                  <p className="text-sm text-slate-600">Let AI create compelling copy for your website</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.generateWithAI}
                  onChange={(e) => setFormData({ ...formData, generateWithAI: e.target.checked })}
                  className="w-5 h-5 text-emerald-600"
                />
              </div>

              {formData.generateWithAI && (
                <>
                  <div>
                    <Label htmlFor="aiTone">Content Tone & Style</Label>
                    <Select
                      value={formData.aiTone}
                      onValueChange={(value) => setFormData({ ...formData, aiTone: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury & Premium</SelectItem>
                        <SelectItem value="budget">Budget-Friendly & Affordable</SelectItem>
                        <SelectItem value="investor">Investor-Focused</SelectItem>
                        <SelectItem value="family">Family-Oriented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., Young professionals, Families, Retirees"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Template Selection */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <div className="flex items-center gap-3 mb-2">
                <LayoutTemplate className="w-6 h-6 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Choose Your Template</h3>
              </div>
              <p className="text-sm text-slate-600">Select a design template for your website</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setFormData({ ...formData, selectedTemplate: template.id })}
                  className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    formData.selectedTemplate === template.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-24 h-24 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={`https://images.unsplash.com/${template.thumbnail}?w=200&h=200&fit=crop`}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-bold text-slate-900 mb-1">{template.name}</h4>
                    <p className="text-sm text-slate-600">{template.description}</p>
                  </div>
                  {formData.selectedTemplate === template.id && (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Summary */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-bold text-slate-900 mb-3">Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Project:</span>
                  <span className="font-medium text-slate-900">{formData.projectName || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-medium text-slate-900">{formData.location || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Type:</span>
                  <span className="font-medium text-slate-900">{formData.propertyType || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Configurations:</span>
                  <span className="font-medium text-slate-900">
                    {formData.configurations.length > 0 ? formData.configurations.join(", ") : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Amenities:</span>
                  <span className="font-medium text-slate-900">{formData.amenities.length} selected</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Upload Files & Additional Content */}
        {step === 6 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Upload className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Upload Files & Additional Content</h3>
              </div>
              <p className="text-sm text-slate-600">Upload images, brochures, floor plans, and add additional content for AI to use</p>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <Label>Upload Files (Images, PDFs, Documents)</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors bg-slate-50">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUpload"
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Images, PDFs, Word documents (Max 10MB each)
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Uploaded Files ({uploadedFiles.length})</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFiles([])}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto p-2 bg-slate-50 rounded-lg">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors"
                      >
                        {/* File Icon/Preview */}
                        <div className="flex-shrink-0">
                          {file.preview ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <img
                                src={file.preview}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                              {file.type.includes('pdf') ? (
                                <FileText className="w-6 h-6 text-red-600" />
                              ) : (
                                <File className="w-6 h-6 text-slate-600" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {file.type.split('/')[1]?.toUpperCase() || 'FILE'}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {file.preview && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(file.preview, '_blank')}
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFile(file.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Additional Content Fields */}
            <div className="border-t border-slate-200 pt-6">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Paperclip className="w-5 h-5 text-emerald-600" />
                Additional Content for AI
              </h4>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyHighlights">Key Highlights</Label>
                  <Textarea
                    id="keyHighlights"
                    placeholder="e.g., Prime location, Vastu compliant, Ready to move, etc."
                    value={additionalContent.keyHighlights}
                    onChange={(e) => setAdditionalContent({ ...additionalContent, keyHighlights: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="developerInfo">Developer Information</Label>
                  <Textarea
                    id="developerInfo"
                    placeholder="Information about the developer, their track record, awards, etc."
                    value={additionalContent.developerInfo}
                    onChange={(e) => setAdditionalContent({ ...additionalContent, developerInfo: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="nearbyLocations">Nearby Locations & Connectivity</Label>
                  <Textarea
                    id="nearbyLocations"
                    placeholder="Schools, hospitals, malls, metro stations, airports, etc."
                    value={additionalContent.nearbyLocations}
                    onChange={(e) => setAdditionalContent({ ...additionalContent, nearbyLocations: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="specialOffers">Special Offers & Payment Plans</Label>
                  <Textarea
                    id="specialOffers"
                    placeholder="Launch offers, payment plans, discounts, financing options, etc."
                    value={additionalContent.specialOffers}
                    onChange={(e) => setAdditionalContent({ ...additionalContent, specialOffers: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-3">
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    AI-Powered Content Generation
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Our AI will analyze your uploaded files and content to generate compelling website copy, 
                    suggest layouts, and create an optimized user experience tailored to your property.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 7: Website Tools */}
        {step === 7 && (
          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-6 h-6 text-cyan-600" />
                <h3 className="text-lg font-bold text-slate-900">Select Website Tools</h3>
              </div>
              <p className="text-sm text-slate-600">Choose tools to enhance your website's functionality</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {selectedTools.map(tool => (
                  <div key={tool.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <tool.icon className="w-5 h-5 text-slate-600" />
                      <h4 className="text-sm font-medium text-slate-900">{tool.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{tool.description}</p>
                    <div className="flex items-center justify-between mt-3">
                      <Label className="text-xs text-slate-500">Enable</Label>
                      <input
                        type="checkbox"
                        checked={tool.enabled}
                        onChange={(e) => setSelectedTools(prev => prev.map(t => t.id === tool.id ? { ...t, enabled: e.target.checked } : t))}
                        className="w-5 h-5 text-emerald-600"
                      />
                    </div>
                  </div>
                ))}
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
                <Sparkles className="w-4 h-4 mr-2" />
                Create Website
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