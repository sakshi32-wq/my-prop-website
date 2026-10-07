import { useState } from "react";
import {
  Sparkles,
  Copy,
  RefreshCw,
  Check,
  FileText,
  MessageSquare,
  Share2,
  Wand2,
  Download,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface GenerateContentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentType: "copy" | "whatsapp" | "social" | "faq";
}

export function GenerateContentDialog({ open, onOpenChange, contentType }: GenerateContentDialogProps) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
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

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  const getTitle = () => {
    switch (contentType) {
      case "copy": return "Generate Property Copy";
      case "whatsapp": return "Generate WhatsApp Campaign";
      case "social": return "Generate Social Media Posts";
      case "faq": return "Generate FAQs";
    }
  };

  const getIcon = () => {
    switch (contentType) {
      case "copy": return FileText;
      case "whatsapp": return MessageSquare;
      case "social": return Share2;
      case "faq": return Wand2;
    }
  };

  const Icon = getIcon();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-emerald-600" />
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            AI-powered content generation for your property marketing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Input Form */}
          {!generated && (
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

              {contentType === "social" && (
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

              {contentType === "whatsapp" && (
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
          )}

          {/* Generated Content */}
          {generated && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  Generated Content
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGenerated(false)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </div>

              {/* Content for Property Copy */}
              {contentType === "copy" && (
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
                  </TabsContent>

                  <TabsContent value="about" className="space-y-4">
                    <div className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">About Section</Badge>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        Experience premium living at {formData.projectName}, redefining modern residential 
                        development. Perfectly designed for {formData.targetAudience || "discerning buyers"}, 
                        our thoughtfully crafted {formData.propertyType}s offer the perfect blend of 
                        contemporary design and timeless elegance in {formData.location}.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="features" className="space-y-4">
                    <div className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="outline">Amenities</Badge>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <ul className="space-y-2">
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
                      <p className="text-slate-700">
                        Don't miss this opportunity to be part of {formData.location}'s most prestigious address. 
                        Schedule a site visit today and experience luxury living firsthand.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}

              {/* Content for WhatsApp Campaign */}
              {contentType === "whatsapp" && (
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

              {/* Content for Social Media */}
              {contentType === "social" && (
                <div className="space-y-4">
                  {[
                    {
                      title: "Launch Announcement",
                      content: `🏡 Introducing ${formData.projectName || "Your Dream Home"}! ✨\n\nDiscover luxury living in the heart of ${formData.location}. Premium ${formData.propertyType}s designed for modern lifestyle.\n\n${formData.features?.split(',').slice(0, 3).map(f => `✓ ${f.trim()}`).join('\n') || '✓ Premium amenities'}\n\n📞 Book your site visit today!\n\n#RealEstate #LuxuryHomes #${formData.location?.replace(/[, ]/g, '')} #NewLaunch`,
                      hashtags: "#RealEstate #LuxuryHomes #NewLaunch"
                    },
                    {
                      title: "Amenities Showcase",
                      content: `Life at ${formData.projectName} means waking up to:\n\n${formData.features?.split(',').slice(0, 4).map((f, i) => `${i + 1}. ${f.trim()}`).join('\n') || '1. World-class amenities'}\n\nAnd so much more! 🌟\n\nExperience the lifestyle you deserve.\n\n#LuxuryLiving #PropertyGoals #DreamHome`,
                      hashtags: "#LuxuryLiving #PropertyGoals"
                    },
                    {
                      title: "Limited Offer",
                      content: `⚡ EXCLUSIVE OFFER ALERT! ⚡\n\nPre-launch prices at ${formData.projectName}!\n\n🎁 Special pricing for early birds\n📍 ${formData.location}\n💎 Premium ${formData.propertyType}s\n\nDon't miss out! Limited units available.\n\nDM us or call now! 📞\n\n#LimitedOffer #RealEstateDeals #Investment`,
                      hashtags: "#LimitedOffer #RealEstateDeals"
                    }
                  ].map((post, index) => (
                    <div key={index} className="p-6 rounded-lg border-2 border-slate-200 bg-white">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)} Post {index + 1}
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

              {/* Content for FAQs */}
              {contentType === "faq" && (
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

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                  <Check className="w-4 h-4 mr-2" />
                  Use This Content
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Export as PDF
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
