import { 
  User, 
  Globe, 
  CreditCard, 
  Users, 
  Key, 
  MessageSquare,
  Bell,
  Shield,
  Link as LinkIcon,
  Save,
  Plus,
  Trash2,
  CheckCircle,
  Copy,
  ExternalLink,
  AlertCircle,
  Mail,
  Send,
  Calendar,
  BarChart3,
  DollarSign,
  Phone,
  Database,
  Eye,
  EyeOff
} from "lucide-react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

export function Settings() {
  const [open, setOpen] = useState(false);
  const [addDomainOpen, setAddDomainOpen] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState("");
  const [domainName, setDomainName] = useState("");
  const [showDNSRecords, setShowDNSRecords] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Agent");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [generateAPIKeyOpen, setGenerateAPIKeyOpen] = useState(false);
  const [apiKeyName, setApiKeyName] = useState("");
  const [apiKeyType, setApiKeyType] = useState("production");
  const [generatedKey, setGeneratedKey] = useState("");
  const [showGeneratedKey, setShowGeneratedKey] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="company">Company Name</Label>
                <Input id="company" defaultValue="Acme Real Estate" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+91 98765 43210" className="mt-1" />
              </div>

              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">New Lead Notifications</p>
                  <p className="text-sm text-slate-600">Get notified when you receive a new lead</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Campaign Updates</p>
                  <p className="text-sm text-slate-600">Receive updates on your campaign performance</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">WhatsApp Replies</p>
                  <p className="text-sm text-slate-600">Get notified when leads reply via WhatsApp</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">Weekly Reports</p>
                  <p className="text-sm text-slate-600">Receive weekly performance summary emails</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" className="mt-1" />
              </div>
              <Button variant="outline">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Domain Settings */}
        <TabsContent value="domains" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Custom Domains
                </CardTitle>
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  onClick={() => setAddDomainOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Domain
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { domain: "skylineheights.com", status: "active", website: "Skyline Heights" },
                { domain: "marinabay.in", status: "pending", website: "Marina Bay Apartments" },
                { domain: "greenvalley.com", status: "active", website: "Green Valley Villas" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.domain}</p>
                      <p className="text-sm text-slate-600">{item.website}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={item.status === "active" ? "default" : "secondary"}>
                      {item.status === "active" ? "● Active" : "⏳ Pending"}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <LinkIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">How to connect your custom domain</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>Purchase a domain from any domain registrar</li>
                  <li>Add your domain in the settings above</li>
                  <li>Update your DNS settings with the provided records</li>
                  <li>Wait for DNS propagation (usually 24-48 hours)</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Team Members
                </CardTitle>
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "John Doe", email: "john@example.com", role: "Owner", avatar: "JD" },
                { name: "Sarah Smith", email: "sarah@example.com", role: "Admin", avatar: "SS" },
                { name: "Mike Johnson", email: "mike@example.com", role: "Agent", avatar: "MJ" },
                { name: "Lisa Chen", email: "lisa@example.com", role: "Agent", avatar: "LC" },
              ].map((member, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                      <span className="font-bold text-emerald-700">{member.avatar}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-600">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary">{member.role}</Badge>
                    {member.role !== "Owner" && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { role: "Owner", permissions: ["Full access to all features", "Manage billing", "Delete account"] },
                  { role: "Admin", permissions: ["Manage websites", "Manage leads", "Manage campaigns", "Invite team members"] },
                  { role: "Agent", permissions: ["View and respond to leads", "View analytics", "Use AI tools"] },
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-bold text-slate-900 mb-2">{item.role}</h4>
                    <ul className="space-y-1">
                      {item.permissions.map((permission, pIndex) => (
                        <li key={pIndex} className="text-sm text-slate-600 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invite Team Member</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Invite a new team member</p>
                    <p className="text-sm text-slate-600">Enter their email and select a role</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setOpen(true)}>Invite</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          {/* WhatsApp Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                WhatsApp Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">WhatsApp Business API</p>
                    <p className="text-sm text-slate-600">Connected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-green-500">● Active</Badge>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>

              <div>
                <Label htmlFor="whatsappNumber">WhatsApp Business Number</Label>
                <Input id="whatsappNumber" defaultValue="+91 98765 43210" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="whatsappKey">API Key</Label>
                <Input id="whatsappKey" type="password" defaultValue="sk_live_••••••••••••••••" className="mt-1" />
              </div>

              <Button variant="outline">Test Connection</Button>
            </CardContent>
          </Card>

          {/* Email Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Email Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-lg hover:border-emerald-300 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Gmail</p>
                      <p className="text-sm text-slate-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-lg hover:border-emerald-300 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Outlook</p>
                      <p className="text-sm text-slate-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SMS Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                SMS Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 border-2 border-purple-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Twilio SMS</p>
                    <p className="text-sm text-slate-600">Connected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-500">● Active</Badge>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>

              <div>
                <Label htmlFor="twilioSID">Account SID</Label>
                <Input id="twilioSID" type="password" defaultValue="AC••••••••••••••••••••" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="twilioToken">Auth Token</Label>
                <Input id="twilioToken" type="password" defaultValue="••••••••••••••••••••" className="mt-1" />
              </div>

              <Button variant="outline">Test Connection</Button>
            </CardContent>
          </Card>

          {/* Calendar Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Calendar Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-lg hover:border-emerald-300 cursor-pointer transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Google Calendar</p>
                    <p className="text-sm text-slate-600">Sync site visit appointments</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Google Analytics</p>
                    <p className="text-sm text-slate-600">Connected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-orange-500">● Active</Badge>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>

              <div>
                <Label htmlFor="gaTrackingID">Tracking ID</Label>
                <Input id="gaTrackingID" defaultValue="G-XXXXXXXXXX" className="mt-1" />
              </div>

              <Button variant="outline">Test Connection</Button>
            </CardContent>
          </Card>

          {/* Payment Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Gateways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Razorpay</p>
                      <p className="text-sm text-slate-600">Connected</p>
                    </div>
                  </div>
                  <Badge className="bg-blue-500">● Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-lg hover:border-emerald-300 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Stripe</p>
                      <p className="text-sm text-slate-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CRM Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                CRM Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-lg hover:border-emerald-300 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Salesforce</p>
                      <p className="text-sm text-slate-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border-2 border-slate-200 rounded-lg hover:border-emerald-300 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Database className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Zoho CRM</p>
                      <p className="text-sm text-slate-600">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Use these API keys to integrate myprop.live with your existing systems
              </p>

              {[
                { name: "Production API Key", key: "sk_live_••••••••••••••••", created: "Jan 15, 2026" },
                { name: "Development API Key", key: "sk_test_••••••••••••••••", created: "Jan 10, 2026" },
              ].map((apiKey, index) => (
                <div key={index} className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg">
                  <div>
                    <p className="font-bold text-slate-900">{apiKey.name}</p>
                    <p className="text-sm text-slate-600 font-mono">{apiKey.key}</p>
                    <p className="text-xs text-slate-500 mt-1">Created: {apiKey.created}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">Reveal</Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={() => setGenerateAPIKeyOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Generate New API Key
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Growth Plan</h3>
                    <p className="text-slate-600">Perfect for growing developers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900">₹14,999</p>
                    <p className="text-sm text-slate-600">per month</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Websites</p>
                    <p className="text-xl font-bold text-slate-900">8 / 15</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Leads This Month</p>
                    <p className="text-xl font-bold text-slate-900">2,847 / 5,000</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-slate-600">Next Billing</p>
                    <p className="text-xl font-bold text-slate-900">Mar 15</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                    Upgrade Plan
                  </Button>
                  <Button variant="outline">Cancel Subscription</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border-2 border-slate-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">•••• •••• •••• 4242</p>
                    <p className="text-sm text-slate-600">Expires 12/26</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>Default</Badge>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Feb 15, 2026", amount: "₹14,999", status: "Paid", invoice: "INV-2026-002" },
                  { date: "Jan 15, 2026", amount: "₹14,999", status: "Paid", invoice: "INV-2026-001" },
                  { date: "Dec 15, 2025", amount: "₹14,999", status: "Paid", invoice: "INV-2025-012" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{item.date}</p>
                      <p className="text-sm text-slate-600">{item.invoice}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-slate-900">{item.amount}</p>
                      <Badge className="bg-emerald-500">{item.status}</Badge>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite Team Member Dialog */}
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          // Reset form when closing
          setInviteEmail("");
          setSelectedRole("Agent");
        }
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Send an invitation to join your team. They will receive an email with instructions to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="inviteEmail" className="text-base font-medium">
                Email Address *
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  id="inviteEmail"
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-slate-500 mt-1.5">
                They will receive an invitation link via email
              </p>
            </div>

            <div>
              <Label htmlFor="inviteRole" className="text-base font-medium">
                Role *
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Admin</span>
                      <span className="text-xs text-slate-500">Full access except billing</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Agent">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Agent</span>
                      <span className="text-xs text-slate-500">Can manage leads and view analytics</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-900 mb-1">Permissions for {selectedRole}</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {selectedRole === "Admin" && (
                      <>
                        <li>• Manage all websites and leads</li>
                        <li>• Create and manage campaigns</li>
                        <li>• Invite team members</li>
                        <li>• Use AI tools</li>
                      </>
                    )}
                    {selectedRole === "Agent" && (
                      <>
                        <li>• View and respond to leads</li>
                        <li>• View analytics dashboard</li>
                        <li>• Use AI tools</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              disabled={!inviteEmail || !inviteEmail.includes("@")}
              onClick={() => {
                setInviteSuccess(true);
                setOpen(false);
                // Show success message
                setTimeout(() => {
                  alert(`Invitation sent to ${inviteEmail} as ${selectedRole}!`);
                  setInviteEmail("");
                  setSelectedRole("Agent");
                }, 100);
              }}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Domain Dialog */}
      <Dialog open={addDomainOpen} onOpenChange={setAddDomainOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" />
              Add Custom Domain
            </DialogTitle>
            <DialogDescription>
              Connect your custom domain to one of your websites
            </DialogDescription>
          </DialogHeader>

          {!showDNSRecords ? (
            <div className="space-y-5">
              <div>
                <Label htmlFor="domainName" className="text-base font-medium">
                  Domain Name *
                </Label>
                <Input
                  id="domainName"
                  placeholder="example.com"
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="mt-2"
                />
                <p className="text-sm text-slate-500 mt-1.5">
                  Enter your domain without http:// or https://
                </p>
              </div>

              <div>
                <Label htmlFor="website" className="text-base font-medium">
                  Select Website *
                </Label>
                <Select value={selectedWebsite} onValueChange={setSelectedWebsite}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a website to connect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="skyline">Skyline Heights</SelectItem>
                    <SelectItem value="marina">Marina Bay Apartments</SelectItem>
                    <SelectItem value="green">Green Valley Villas</SelectItem>
                    <SelectItem value="ocean">Ocean View Residency</SelectItem>
                    <SelectItem value="royal">Royal Gardens</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-slate-500 mt-1.5">
                  This domain will point to the selected website
                </p>
              </div>

              <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-amber-900 mb-1">Before you continue</h4>
                    <ul className="text-sm text-amber-800 space-y-1">
                      <li>• Make sure you own this domain</li>
                      <li>• Have access to your domain's DNS settings</li>
                      <li>• DNS changes may take 24-48 hours to propagate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-bold text-emerald-900">Domain Added Successfully!</h4>
                </div>
                <p className="text-sm text-emerald-800">
                  Now configure your DNS settings to complete the connection
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3">Configure DNS Records</h4>
                <p className="text-sm text-slate-600 mb-4">
                  Add these DNS records to your domain registrar (GoDaddy, Namecheap, etc.)
                </p>

                <div className="space-y-3">
                  {/* A Record */}
                  <div className="p-4 border-2 border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">A Record</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("76.76.21.21");
                          alert("IP address copied!");
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">Type</p>
                        <p className="font-mono font-medium text-slate-900">A</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Name</p>
                        <p className="font-mono font-medium text-slate-900">@</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Value</p>
                        <p className="font-mono font-medium text-slate-900">76.76.21.21</p>
                      </div>
                    </div>
                  </div>

                  {/* CNAME Record */}
                  <div className="p-4 border-2 border-slate-200 rounded-lg bg-slate-50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">CNAME Record</Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("cname.myprop.live");
                          alert("CNAME copied!");
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">Type</p>
                        <p className="font-mono font-medium text-slate-900">CNAME</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Name</p>
                        <p className="font-mono font-medium text-slate-900">www</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Value</p>
                        <p className="font-mono font-medium text-slate-900">cname.myprop.live</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Need Help?</h4>
                    <p className="text-sm text-blue-800 mb-2">
                      Check our detailed guides for popular domain registrars:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="link" className="h-auto p-0 text-blue-700 hover:text-blue-900" size="sm">
                        GoDaddy Guide
                      </Button>
                      <span className="text-blue-300">•</span>
                      <Button variant="link" className="h-auto p-0 text-blue-700 hover:text-blue-900" size="sm">
                        Namecheap Guide
                      </Button>
                      <span className="text-blue-300">•</span>
                      <Button variant="link" className="h-auto p-0 text-blue-700 hover:text-blue-900" size="sm">
                        Cloudflare Guide
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => {
              setAddDomainOpen(false);
              setShowDNSRecords(false);
              setDomainName("");
              setSelectedWebsite("");
            }}>
              {showDNSRecords ? "Done" : "Cancel"}
            </Button>
            {!showDNSRecords && (
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
                disabled={!domainName || !selectedWebsite}
                onClick={() => setShowDNSRecords(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Domain
              </Button>
            )}
            {showDNSRecords && (
              <Button 
                type="button"
                className="bg-gradient-to-r from-emerald-500 to-teal-600"
                onClick={() => {
                  alert("Checking DNS configuration...");
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify DNS
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate API Key Dialog */}
      <Dialog open={generateAPIKeyOpen} onOpenChange={setGenerateAPIKeyOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-600" />
              Generate New API Key
            </DialogTitle>
            <DialogDescription>
              Create a new API key for your application. Choose a name and type for the key.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div>
              <Label htmlFor="apiKeyName" className="text-base font-medium">
                Key Name *
              </Label>
              <Input
                id="apiKeyName"
                placeholder="My Production Key"
                value={apiKeyName}
                onChange={(e) => setApiKeyName(e.target.value)}
                className="mt-2"
              />
              <p className="text-sm text-slate-500 mt-1.5">
                A descriptive name for your API key
              </p>
            </div>

            <div>
              <Label htmlFor="apiKeyType" className="text-base font-medium">
                Key Type *
              </Label>
              <Select value={apiKeyType} onValueChange={setApiKeyType}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Production</span>
                      <span className="text-xs text-slate-500">For live applications</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="development">
                    <div className="flex flex-col items-start">
                      <span className="font-medium">Development</span>
                      <span className="text-xs text-slate-500">For testing and development</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Before you continue</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Ensure you have a secure environment for storing API keys</li>
                    <li>• Do not share your API keys with unauthorized users</li>
                    <li>• Revoke keys if they are compromised</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setGenerateAPIKeyOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-emerald-500 to-teal-600"
              disabled={!apiKeyName}
              onClick={() => {
                // Simulate key generation
                const key = apiKeyType === "production" ? "sk_live_••••••••••••••••" : "sk_test_••••••••••••••••";
                setGeneratedKey(key);
                setShowGeneratedKey(true);
                setGenerateAPIKeyOpen(false);
                // Show success message
                setTimeout(() => {
                  alert(`API key generated: ${key}`);
                  setApiKeyName("");
                  setApiKeyType("production");
                }, 100);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Generate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}