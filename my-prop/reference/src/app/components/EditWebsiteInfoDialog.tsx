import { useState } from "react";
import {
  Building2,
  MapPin,
  Home,
  Ruler,
  Wand2,
  LayoutTemplate,
  Upload,
  Wrench,
  Check,
  X,
  File,
  FileText,
  Eye,
  Paperclip,
  Mail,
  MessageSquare,
  Phone,
  BarChart2,
  Gift,
  Bell,
  Calculator,
  Video,
  Calendar,
  Sparkles
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface EditWebsiteInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  websiteData?: WebsiteInfo;
  onSave?: (data: WebsiteInfo) => void;
}

interface WebsiteInfo {
  projectName: string;
  location: string;
  description: string;
  propertyType: string;
  configurations: string[];
  priceRange: string;
  amenities: string[];
  targetAudience: string;
  aiTone: string;
  selectedTemplate: number;
  generateWithAI: boolean;
  uploadedFiles: UploadedFile[];
  additionalContent: {
    keyHighlights: string;
    developerInfo: string;
    nearbyLocations: string;
    specialOffers: string;
  };
  tools: WebsiteTool[];
}

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
}

const amenitiesList = [
  "Swimming Pool", "Gym", "Garden", "Parking", "24/7 Security",
  "Club House", "Kids Play Area", "Jogging Track", "Indoor Games",
  "Power Backup", "Elevator", "CCTV", "Intercom", "Fire Safety"
];

const websiteTools: WebsiteTool[] = [
  { id: 'contact-form', name: 'Contact Form', description: 'Allow visitors to contact you directly', category: 'lead-generation', icon: Mail, enabled: true },
  { id: 'lead-capture', name: 'Lead Capture Form', description: 'Capture visitor information with custom forms', category: 'lead-generation', icon: MessageSquare, enabled: false },
  { id: 'whatsapp-chat', name: 'WhatsApp Chat Widget', description: 'Enable WhatsApp chat for instant communication', category: 'engagement', icon: Phone, enabled: true },
  { id: 'schedule-visit', name: 'Schedule Visit', description: 'Let visitors book property visits', category: 'lead-generation', icon: Calendar, enabled: false },
  { id: 'live-chat', name: 'Live Chat', description: 'Real-time chat with visitors', category: 'engagement', icon: MessageSquare, enabled: false },
  { id: 'email-popup', name: 'Email Popup', description: 'Collect emails with popup forms', category: 'lead-generation', icon: Mail, enabled: false },
  { id: 'promotion-banner', name: 'Promotion Banner', description: 'Display special offers and announcements', category: 'engagement', icon: Gift, enabled: false },
  { id: 'notifications', name: 'Push Notifications', description: 'Send updates to subscribed visitors', category: 'engagement', icon: Bell, enabled: false },
  { id: 'google-analytics', name: 'Google Analytics', description: 'Track website traffic and behavior', category: 'analytics', icon: BarChart2, enabled: false },
  { id: 'facebook-pixel', name: 'Facebook Pixel', description: 'Track conversions and retarget visitors', category: 'analytics', icon: BarChart2, enabled: false },
  { id: 'call-tracking', name: 'Call Tracking', description: 'Track phone call conversions', category: 'analytics', icon: Phone, enabled: false },
  { id: 'virtual-tour', name: 'Virtual Tour', description: '360° property tours', category: 'utilities', icon: Video, enabled: false },
  { id: 'emi-calculator', name: 'EMI Calculator', description: 'Help visitors calculate loan EMIs', category: 'utilities', icon: Calculator, enabled: false },
  { id: 'mortgage-calculator', name: 'Mortgage Calculator', description: 'Calculate mortgage and affordability', category: 'utilities', icon: Calculator, enabled: false },
];

export function EditWebsiteInfoDialog({ open, onOpenChange, websiteData, onSave }: EditWebsiteInfoDialogProps) {
  const [formData, setFormData] = useState<WebsiteInfo>(
    websiteData || {
      projectName: "Skyline Heights",
      location: "Andheri West, Mumbai",
      description: "Luxury residential apartments in the heart of Mumbai",
      propertyType: "apartment",
      configurations: ["2 BHK", "3 BHK"],
      priceRange: "₹80L - ₹1.5Cr",
      amenities: ["Swimming Pool", "Gym", "Parking", "24/7 Security"],
      targetAudience: "Young professionals, Families",
      aiTone: "luxury",
      selectedTemplate: 1,
      generateWithAI: true,
      uploadedFiles: [],
      additionalContent: {
        keyHighlights: "Prime location, Vastu compliant",
        developerInfo: "Award-winning developer with 20+ years experience",
        nearbyLocations: "Metro station 500m, Schools nearby",
        specialOffers: "Limited time offer: 10% discount",
      },
      tools: websiteTools,
    }
  );

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

    setFormData(prev => ({
      ...prev,
      uploadedFiles: [...prev.uploadedFiles, ...newFiles]
    }));
  };

  const removeFile = (id: string) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(file => file.id !== id)
    }));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSave = () => {
    onSave?.(formData);
    toast.success("Website information updated!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-200">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Edit Website Information
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Update your project's website information and settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="basic" className="text-xs">Basic Info</TabsTrigger>
              <TabsTrigger value="property" className="text-xs">Property</TabsTrigger>
              <TabsTrigger value="amenities" className="text-xs">Amenities</TabsTrigger>
              <TabsTrigger value="ai" className="text-xs">AI Settings</TabsTrigger>
              <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
              <TabsTrigger value="content" className="text-xs">Content</TabsTrigger>
              <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[500px] px-6 py-4">
            {/* Basic Information */}
            <TabsContent value="basic" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3 mb-2">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-900">Basic Information</h3>
                </div>
                <p className="text-sm text-slate-600">Update your project's basic details</p>
              </div>

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
            </TabsContent>

            {/* Property Details */}
            <TabsContent value="property" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200">
                <div className="flex items-center gap-3 mb-2">
                  <Home className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900">Property Details</h3>
                </div>
                <p className="text-sm text-slate-600">Update property type and configurations</p>
              </div>

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
            </TabsContent>

            {/* Amenities */}
            <TabsContent value="amenities" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-3 mb-2">
                  <Ruler className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-slate-900">Amenities & Features</h3>
                </div>
                <p className="text-sm text-slate-600">Update amenities your project offers</p>
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
            </TabsContent>

            {/* AI Settings */}
            <TabsContent value="ai" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3 mb-2">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-slate-900">AI Content Generation</h3>
                </div>
                <p className="text-sm text-slate-600">Customize AI content generation settings</p>
              </div>

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
            </TabsContent>

            {/* Files */}
            <TabsContent value="files" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <Upload className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900">Uploaded Files</h3>
                </div>
                <p className="text-sm text-slate-600">Manage images, brochures, and documents</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-emerald-400 transition-colors bg-slate-50">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="fileUploadEdit"
                />
                <label htmlFor="fileUploadEdit" className="cursor-pointer">
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

              {formData.uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Uploaded Files ({formData.uploadedFiles.length})</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFormData({ ...formData, uploadedFiles: [] })}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear all
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 max-h-[300px] overflow-y-auto p-2 bg-slate-50 rounded-lg">
                    {formData.uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-emerald-300 transition-colors"
                      >
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
            </TabsContent>

            {/* Additional Content */}
            <TabsContent value="content" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-3 mb-2">
                  <Paperclip className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-slate-900">Additional Content</h3>
                </div>
                <p className="text-sm text-slate-600">Update additional content for AI to use</p>
              </div>

              <div>
                <Label htmlFor="keyHighlights">Key Highlights</Label>
                <Textarea
                  id="keyHighlights"
                  placeholder="e.g., Prime location, Vastu compliant, Ready to move, etc."
                  value={formData.additionalContent.keyHighlights}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalContent: { ...formData.additionalContent, keyHighlights: e.target.value }
                  })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="developerInfo">Developer Information</Label>
                <Textarea
                  id="developerInfo"
                  placeholder="Information about the developer, their track record, awards, etc."
                  value={formData.additionalContent.developerInfo}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalContent: { ...formData.additionalContent, developerInfo: e.target.value }
                  })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="nearbyLocations">Nearby Locations & Connectivity</Label>
                <Textarea
                  id="nearbyLocations"
                  placeholder="Schools, hospitals, malls, metro stations, airports, etc."
                  value={formData.additionalContent.nearbyLocations}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalContent: { ...formData.additionalContent, nearbyLocations: e.target.value }
                  })}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="specialOffers">Special Offers & Payment Plans</Label>
                <Textarea
                  id="specialOffers"
                  placeholder="Launch offers, payment plans, discounts, financing options, etc."
                  value={formData.additionalContent.specialOffers}
                  onChange={(e) => setFormData({
                    ...formData,
                    additionalContent: { ...formData.additionalContent, specialOffers: e.target.value }
                  })}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Website Tools */}
            <TabsContent value="tools" className="mt-0 space-y-4">
              <div className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <div className="flex items-center gap-3 mb-2">
                  <Wrench className="w-5 h-5 text-cyan-600" />
                  <h3 className="font-bold text-slate-900">Website Tools</h3>
                </div>
                <p className="text-sm text-slate-600">Configure website tools and features</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.tools.map(tool => (
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
                        onChange={(e) => setFormData({
                          ...formData,
                          tools: formData.tools.map(t => t.id === tool.id ? { ...t, enabled: e.target.checked } : t)
                        })}
                        className="w-5 h-5 text-emerald-600"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>

          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}