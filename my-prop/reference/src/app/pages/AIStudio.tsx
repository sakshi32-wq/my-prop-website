import { useState } from "react";
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Check, 
  FileText, 
  MessageSquare, 
  Image as ImageIcon,
  Share2,
  Globe,
  Wand2,
  Clock,
  Eye,
  Download,
  Trash2,
  ChevronRight,
  Code2,
  Send,
  Monitor,
  Smartphone,
  Tablet,
  Maximize2,
  Minimize2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../components/ui/sheet";
import { AIWebPageDesigner } from "../components/AIWebPageDesigner";

const aiTools = [
  {
    id: "webpage",
    name: "AI Web Page Designer",
    icon: Code2,
    description: "Design web pages with AI - chat and preview in real-time",
    color: "blue"
  },
  {
    id: "website",
    name: "Generate Full Website",
    icon: Globe,
    description: "Create complete property website with all sections",
    color: "emerald"
  },
  {
    id: "copy",
    name: "Generate Copy",
    icon: FileText,
    description: "Write compelling property descriptions",
    color: "teal"
  },
  {
    id: "whatsapp",
    name: "WhatsApp Campaign",
    icon: MessageSquare,
    description: "Create WhatsApp message sequences",
    color: "green"
  },
  {
    id: "social",
    name: "Social Media Posts",
    icon: Share2,
    description: "Generate posts for Instagram, Facebook",
    color: "purple"
  },
  {
    id: "faq",
    name: "Create FAQs",
    icon: Wand2,
    description: "Generate frequently asked questions",
    color: "amber"
  },
];

// Mock recent generations data
const recentGenerationsData = [
  {
    id: 1,
    title: "Skyline Heights Copy",
    type: "copy",
    projectName: "Skyline Heights",
    location: "Andheri West, Mumbai",
    timestamp: "2 hours ago",
    date: "Feb 20, 2026 - 2:30 PM",
    preview: "Welcome to Skyline Heights - Where Luxury Meets Comfort in the Heart of Andheri West, Mumbai",
    status: "completed"
  },
  {
    id: 2,
    title: "WhatsApp Campaign - Marina Bay",
    type: "whatsapp",
    projectName: "Marina Bay",
    location: "Worli, Mumbai",
    timestamp: "5 hours ago",
    date: "Feb 20, 2026 - 11:00 AM",
    preview: "Hi {name}! 👋 Exciting news! We're launching Marina Bay in Worli, Mumbai...",
    status: "completed"
  },
  {
    id: 3,
    title: "FAQ Generation - Green Valley",
    type: "faq",
    projectName: "Green Valley",
    location: "Thane, Mumbai",
    timestamp: "1 day ago",
    date: "Feb 19, 2026 - 4:15 PM",
    preview: "What is Green Valley? Green Valley is a premium apartment development...",
    status: "completed"
  },
  {
    id: 4,
    title: "Social Media Posts - Ocean View",
    type: "social",
    projectName: "Ocean View Residency",
    location: "Bandra West, Mumbai",
    timestamp: "2 days ago",
    date: "Feb 18, 2026 - 10:00 AM",
    preview: "🏡 Introducing Ocean View Residency! ✨ Discover luxury living in Bandra West...",
    status: "completed"
  },
  {
    id: 5,
    title: "Property Copy - Royal Gardens",
    type: "copy",
    projectName: "Royal Gardens",
    location: "Powai, Mumbai",
    timestamp: "3 days ago",
    date: "Feb 17, 2026 - 3:45 PM",
    preview: "Experience premium living at Royal Gardens, Powai's newest landmark...",
    status: "completed"
  },
  {
    id: 6,
    title: "WhatsApp Campaign - Sunset Heights",
    type: "whatsapp",
    projectName: "Sunset Heights",
    location: "Goregaon East, Mumbai",
    timestamp: "5 days ago",
    date: "Feb 15, 2026 - 1:20 PM",
    preview: "Hi {name}! We have an exclusive limited-time offer on Sunset Heights!",
    status: "completed"
  },
  {
    id: 7,
    title: "FAQ - Emerald Towers",
    type: "faq",
    projectName: "Emerald Towers",
    location: "Kandivali West, Mumbai",
    timestamp: "1 week ago",
    date: "Feb 13, 2026 - 9:30 AM",
    preview: "What is Emerald Towers? Emerald Towers is a premium villa development...",
    status: "completed"
  },
];

export function AIStudio() {
  const [selectedTool, setSelectedTool] = useState("copy");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [isRecentGenerationsOpen, setIsRecentGenerationsOpen] = useState(false);
  const [selectedGeneration, setSelectedGeneration] = useState<any>(null);
  const [formData, setFormData] = useState({
    projectName: "",
    location: "",
    propertyType: "apartment",
    tone: "luxury",
    features: "",
    targetAudience: "",
    platform: "instagram",
    numPosts: "3",
    campaignGoal: "",
  });
  
  // Web Page Designer state
  const [pagePrompt, setPagePrompt] = useState("");
  const [chatMessages, setChatMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [isGeneratingPage, setIsGeneratingPage] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showCode, setShowCode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const handleToolClick = (toolId: string) => {
    setSelectedTool(toolId);
    setGenerated(false); // Reset generated state when switching tools
  };

  const getToolTitle = () => {
    const tool = aiTools.find(t => t.id === selectedTool);
    return tool?.name || "Generate Content";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">AI Studio</h1>
        <p className="text-slate-600 mt-1">Generate content, copy, and campaigns with AI</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tool Selection */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {aiTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTool === tool.id
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 bg-${tool.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <tool.icon className={`w-5 h-5 text-${tool.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 mb-1">{tool.name}</h3>
                      <p className="text-sm text-slate-600">{tool.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setIsRecentGenerationsOpen(true)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Generations</CardTitle>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentGenerationsData.slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    className="p-3 rounded-lg border border-slate-200 hover:border-emerald-300 cursor-pointer transition-all"
                    onClick={() => {
                      setSelectedGeneration(item);
                      setIsRecentGenerationsOpen(true);
                    }}
                  >
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{item.timestamp}</p>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setIsRecentGenerationsOpen(true)}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  View All History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={isFullscreen ? "fixed inset-0 z-50 rounded-none m-0 overflow-auto" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{getToolTitle()}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="hover:bg-slate-100"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* AI Web Page Designer - Bolt/v0 Style Interface */}
              {selectedTool === "webpage" && <AIWebPageDesigner />}

              {/* Website Tool - Show Message */}
              {selectedTool === "website" && (
                <div className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Globe className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Generate Full Website with AI</h3>
                    <p className="text-slate-600 mb-6">
                      Create a complete property website with all sections, content, and layouts powered by AI
                    </p>
                    <Button
                      onClick={() => {
                        // You can add CreateWebsiteWizard trigger here if needed
                        alert("Website wizard will open - integrate CreateWebsiteWizard if needed");
                      }}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      size="lg"
                    >
                      <Sparkles className="w-5 h-5 mr-2" />
                      Start Website Wizard
                    </Button>
                  </div>
                </div>
              )}

              {/* Common Input Form for all except website */}
              {selectedTool !== "website" && selectedTool !== "webpage" && (
                <>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
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
                        <Input
                          id="location"
                          placeholder="e.g., Andheri West, Mumbai"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select
                          value={formData.propertyType}
                          onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="penthouse">Penthouse</SelectItem>
                            <SelectItem value="plot">Plot</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tone">Content Tone</Label>
                        <Select
                          value={formData.tone}
                          onValueChange={(value) => setFormData({ ...formData, tone: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="luxury">Luxury & Premium</SelectItem>
                            <SelectItem value="budget">Budget-Friendly</SelectItem>
                            <SelectItem value="investor">Investor-Focused</SelectItem>
                            <SelectItem value="family">Family-Oriented</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Social Media Specific Fields */}
                    {selectedTool === "social" && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="platform">Platform</Label>
                          <Select
                            value={formData.platform}
                            onValueChange={(value) => setFormData({ ...formData, platform: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="twitter">Twitter/X</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="numPosts">Number of Posts</Label>
                          <Select
                            value={formData.numPosts}
                            onValueChange={(value) => setFormData({ ...formData, numPosts: value })}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3 Posts</SelectItem>
                              <SelectItem value="5">5 Posts</SelectItem>
                              <SelectItem value="10">10 Posts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp Specific Fields */}
                    {selectedTool === "whatsapp" && (
                      <div>
                        <Label htmlFor="campaignGoal">Campaign Goal</Label>
                        <Select
                          value={formData.campaignGoal}
                          onValueChange={(value) => setFormData({ ...formData, campaignGoal: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select campaign goal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="launch">New Launch Announcement</SelectItem>
                            <SelectItem value="sitevisit">Drive Site Visits</SelectItem>
                            <SelectItem value="offer">Limited Time Offer</SelectItem>
                            <SelectItem value="followup">Lead Follow-up</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="features">Key Features (comma separated)</Label>
                      <Textarea
                        id="features"
                        placeholder="e.g., Swimming Pool, Gym, 24/7 Security, Garden"
                        value={formData.features}
                        onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Input
                        id="targetAudience"
                        placeholder="e.g., Young professionals, Families"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        className="mt-1"
                      />
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={generating || !formData.projectName || !formData.location}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      size="lg"
                    >
                      {generating ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                          Generating with AI...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Generated Content */}
                  {generated && (
                    <div className="space-y-4 pt-6 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                          <Check className="w-5 h-5 text-emerald-600" />
                          Generated Content
                        </h3>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setGenerated(false)}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Start Over
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleGenerate}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </div>
                      </div>

                      {/* Property Copy Content */}
                      {selectedTool === "copy" && (
                        <Tabs defaultValue="hero">
                          <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="hero">Hero</TabsTrigger>
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                            <TabsTrigger value="cta">CTA</TabsTrigger>
                          </TabsList>

                          <TabsContent value="hero" className="space-y-4">
                            <div className="p-6 rounded-lg border-2 border-emerald-200 bg-emerald-50/50">
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant="outline" className="bg-white">Headline</Badge>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                Welcome to {formData.projectName || "Your Project"}
                              </h2>
                              <p className="text-xl text-slate-700">
                                Where Luxury Meets Comfort in the Heart of {formData.location || "Prime Location"}
                              </p>
                            </div>

                            <div className="p-6 rounded-lg border-2 border-teal-200 bg-teal-50/50">
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant="outline" className="bg-white">Description</Badge>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <p className="text-slate-700 leading-relaxed">
                                Experience premium living at {formData.projectName}, {formData.location}'s newest landmark in luxury residential development. 
                                Perfectly designed for {formData.targetAudience || "discerning buyers"}, our thoughtfully crafted {formData.propertyType}s offer the perfect 
                                blend of contemporary design and timeless elegance.
                              </p>
                            </div>
                          </TabsContent>

                          <TabsContent value="about" className="space-y-4">
                            <div className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant="outline">About Section</Badge>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-4">About {formData.projectName}</h3>
                              <p className="text-slate-700 leading-relaxed mb-4">
                                {formData.projectName} redefines modern living with its exceptional architecture and world-class amenities. 
                                Located in the vibrant neighborhood of {formData.location}, this premium development offers unparalleled 
                                connectivity to major business districts, entertainment hubs, and educational institutions.
                              </p>
                              <p className="text-slate-700 leading-relaxed">
                                Each residence is meticulously designed to maximize space, natural light, and ventilation, creating 
                                a living environment that promotes wellness and tranquility. With state-of-the-art facilities and 
                                24/7 security, {formData.projectName} ensures a lifestyle that's both comfortable and secure.
                              </p>
                            </div>
                          </TabsContent>

                          <TabsContent value="features" className="space-y-4">
                            <div className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant="outline">Amenities List</Badge>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <ul className="space-y-3">
                                {(formData.features || "Swimming Pool, Gym, Security").split(",").map((feature, index) => (
                                  <li key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-slate-700">{feature.trim()}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </TabsContent>

                          <TabsContent value="cta" className="space-y-4">
                            <div className="p-6 rounded-lg border-2 border-amber-200 bg-amber-50/50">
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant="outline" className="bg-white">Call to Action</Badge>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                Your Dream Home Awaits
                              </h3>
                              <p className="text-slate-700 mb-4">
                                Don't miss this opportunity to be part of {formData.location}'s most prestigious address. 
                                Schedule a site visit today and experience luxury living firsthand.
                              </p>
                              <div className="flex flex-wrap gap-3">
                                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                                  Schedule Site Visit
                                </Button>
                                <Button variant="outline">
                                  Download Brochure
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}

                      {/* WhatsApp Campaign Content */}
                      {selectedTool === "whatsapp" && (
                        <div className="space-y-4">
                          {[
                            {
                              title: "Initial Message",
                              content: `Hi {name}! 👋\n\nExciting news! We're launching ${formData.projectName || "our newest project"} in ${formData.location || "a prime location"}.\n\n🏡 Premium ${formData.propertyType}s\n✨ World-class amenities\n📍 Prime location\n\nInterested in learning more? Reply YES!`
                            },
                            {
                              title: "Follow-up Message (Day 2)",
                              content: `Hello {name},\n\nJust following up on ${formData.projectName}. We're offering exclusive pre-launch pricing for early birds!\n\nWould you like to schedule a site visit this weekend?\n\nCall us: +91-XXXXXXXXXX`
                            },
                            {
                              title: "Final Reminder",
                              content: `Hi {name},\n\nLast chance! Only a few units left at ${formData.projectName} with special pricing.\n\n⚡ Limited time offer\n🎁 Exclusive benefits for early buyers\n\nBook your site visit today!\n\nTeam ${formData.projectName}`
                            }
                          ].map((msg, index) => (
                            <div key={index} className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <Badge variant="outline" className="mb-2">Message {index + 1}</Badge>
                                  <h4 className="font-bold text-slate-900">{msg.title}</h4>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                                <p className="text-sm text-slate-900 whitespace-pre-wrap font-mono">
                                  {msg.content}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Social Media Content */}
                      {selectedTool === "social" && (
                        <div className="space-y-4">
                          {[
                            {
                              title: "Launch Announcement",
                              content: `🏡 Introducing ${formData.projectName || "Your Dream Home"}! ✨\n\nDiscover luxury living in the heart of ${formData.location}. Premium ${formData.propertyType}s designed for modern lifestyle.\n\n${formData.features?.split(',').slice(0, 3).map(f => `✓ ${f.trim()}`).join('\n') || '✓ Premium amenities'}\n\n📞 Book your site visit today!\n\n#RealEstate #LuxuryHomes #NewLaunch`,
                              hashtags: "#RealEstate #LuxuryHomes #NewLaunch"
                            },
                            {
                              title: "Amenities Showcase",
                              content: `Life at ${formData.projectName} means waking up to:\n\n${formData.features?.split(',').slice(0, 4).map((f, i) => `${i + 1}. ${f.trim()}`).join('\n') || '1. World-class amenities'}\n\nAnd so much more! 🌟\n\nExperience the lifestyle you deserve.\n\n#LuxuryLiving #PropertyGoals`,
                              hashtags: "#LuxuryLiving #PropertyGoals"
                            },
                            {
                              title: "Limited Offer",
                              content: `⚡ EXCLUSIVE OFFER ALERT! ⚡\n\nPre-launch prices at ${formData.projectName}!\n\n🎁 Special pricing for early birds\n📍 ${formData.location}\n💎 Premium ${formData.propertyType}s\n\nDon't miss out! Limited units available.\n\nDM us or call now! 📞\n\n#LimitedOffer #RealEstateDeals`,
                              hashtags: "#LimitedOffer #RealEstateDeals"
                            }
                          ].map((post, index) => (
                            <div key={index} className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <Badge variant="outline" className="mb-2 capitalize">
                                    {formData.platform} Post {index + 1}
                                  </Badge>
                                  <h4 className="font-bold text-slate-900">{post.title}</h4>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                <p className="text-sm text-slate-900 whitespace-pre-wrap mb-3">
                                  {post.content}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {post.hashtags.split(' ').map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* FAQ Content */}
                      {selectedTool === "faq" && (
                        <div className="space-y-4">
                          {[
                            {
                              q: `What is ${formData.projectName || "the project"}?`,
                              a: `${formData.projectName} is a premium ${formData.propertyType} development located in ${formData.location}. It offers modern living spaces with world-class amenities designed for ${formData.targetAudience || "modern families"}.`
                            },
                            {
                              q: "What are the available configurations?",
                              a: `We offer various configurations to suit different family sizes and requirements. Each unit is thoughtfully designed to maximize space and natural light.`
                            },
                            {
                              q: "What amenities are included?",
                              a: `${formData.projectName} features premium amenities including ${formData.features?.split(',').slice(0, 4).join(', ') || "world-class facilities"} and much more.`
                            },
                            {
                              q: "What is the location advantage?",
                              a: `Located in ${formData.location}, the project offers excellent connectivity to major business hubs, educational institutions, healthcare facilities, and entertainment zones.`
                            },
                            {
                              q: "How can I schedule a site visit?",
                              a: "You can schedule a site visit by calling our sales team or filling out the contact form on our website. We offer personalized tours at your convenience."
                            },
                            {
                              q: "What are the payment plans available?",
                              a: "We offer flexible payment plans tailored to your needs. Our team can discuss various options including construction-linked plans and special financing schemes."
                            }
                          ].map((faq, index) => (
                            <div key={index} className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                              <div className="flex items-start justify-between mb-3">
                                <Badge variant="outline">FAQ {index + 1}</Badge>
                                <Button variant="ghost" size="sm">
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                              <p className="text-slate-700 leading-relaxed">{faq.a}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                        <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                          <Check className="w-4 h-4 mr-2" />
                          {selectedTool === "copy" ? "Apply to Website" : "Use This Content"}
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Save to Drafts
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Generations Sheet */}
      <Sheet open={isRecentGenerationsOpen} onOpenChange={setIsRecentGenerationsOpen}>
        <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto px-6">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold text-slate-900">
              Generation History
            </SheetTitle>
            <SheetDescription>
              View and manage all your AI-generated content
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            {recentGenerationsData.map((item) => {
              const tool = aiTools.find(t => t.id === item.type);
              const Icon = tool?.icon || FileText;
              
              return (
                <Card key={item.id} className="border-2 hover:border-emerald-300 transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 bg-${tool?.color || 'emerald'}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${tool?.color || 'emerald'}-600`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <p className="text-xs text-slate-500 mt-1">{item.date}</p>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-700">
                            <Check className="w-3 h-3 mr-1" />
                            {item.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-medium">Project:</span>
                            <span>{item.projectName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <span className="font-medium">Location:</span>
                            <span>{item.location}</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                            <p className="text-sm text-slate-700 line-clamp-2">{item.preview}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              setSelectedGeneration(item);
                              // In a real app, this would load the full content
                              console.log("Viewing:", item);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => {
                              console.log("Downloading:", item);
                              alert("Download feature coming soon!");
                            }}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this generation?")) {
                                console.log("Deleting:", item.id);
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}