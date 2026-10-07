import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  Gauge,
  Zap,
  Eye,
  CheckCircle2,
  Search,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Globe,
  Smartphone,
  Clock,
  FileText,
  Image,
  Code,
  Shield,
  Accessibility,
  Loader2,
} from "lucide-react";

interface LighthouseReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  website: {
    name: string;
    domain: string;
  } | null;
}

interface ScoreData {
  score: number;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
}

interface Issue {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  element?: string;
}

interface MetricData {
  name: string;
  value: string;
  score: number;
  description: string;
}

export function LighthouseReportDialog({
  open,
  onOpenChange,
  website,
}: LighthouseReportDialogProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 3000);
  };

  const scores: ScoreData[] = [
    {
      score: 92,
      label: "Performance",
      icon: Zap,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      score: 88,
      label: "Accessibility",
      icon: Accessibility,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      score: 95,
      label: "Best Practices",
      icon: CheckCircle2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      score: 100,
      label: "SEO",
      icon: Search,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
  ];

  const performanceMetrics: MetricData[] = [
    {
      name: "First Contentful Paint",
      value: "1.2s",
      score: 95,
      description: "Time until first text or image is painted",
    },
    {
      name: "Largest Contentful Paint",
      value: "2.1s",
      score: 92,
      description: "Time until largest text or image is painted",
    },
    {
      name: "Total Blocking Time",
      value: "150ms",
      score: 88,
      description: "Sum of all time periods between FCP and Time to Interactive",
    },
    {
      name: "Cumulative Layout Shift",
      value: "0.05",
      score: 98,
      description: "Measures visual stability",
    },
    {
      name: "Speed Index",
      value: "2.4s",
      score: 90,
      description: "How quickly content is visually displayed",
    },
  ];

  const seoIssues: Issue[] = [
    {
      title: "Meta description",
      description: "Document has a meta description",
      impact: "low",
    },
    {
      title: "Robots.txt is valid",
      description: "Robots.txt file allows search engines to crawl your site",
      impact: "low",
    },
  ];

  const performanceOpportunities: Issue[] = [
    {
      title: "Reduce unused JavaScript",
      description: "Reduce unused JavaScript and defer loading scripts until they are required to decrease bytes consumed by network activity.",
      impact: "high",
      element: "Potential savings of 45 KB",
    },
    {
      title: "Properly size images",
      description: "Serve images that are appropriately-sized to save cellular data and improve load time.",
      impact: "medium",
      element: "Potential savings of 120 KB",
    },
    {
      title: "Enable text compression",
      description: "Text-based resources should be served with compression (gzip, deflate or brotli) to minimize total network bytes.",
      impact: "medium",
      element: "Potential savings of 28 KB",
    },
  ];

  const accessibilityIssues: Issue[] = [
    {
      title: "Image elements have [alt] attributes",
      description: "Informative elements should aim for short, descriptive alternate text. Decorative elements can be ignored with an empty alt attribute.",
      impact: "high",
      element: "2 images missing alt text",
    },
    {
      title: "Contrast ratio",
      description: "Background and foreground colors do not have a sufficient contrast ratio.",
      impact: "medium",
      element: "3 elements with low contrast",
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-emerald-100";
    if (score >= 50) return "bg-amber-100";
    return "bg-red-100";
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-emerald-600" />
            Lighthouse Report - {website?.name}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {website?.domain}
          </DialogDescription>
        </DialogHeader>

        {!reportGenerated ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
              {isGenerating ? (
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              ) : (
                <Gauge className="w-12 h-12 text-emerald-600" />
              )}
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-slate-900">
                {isGenerating ? "Generating Report..." : "Run Lighthouse Analysis"}
              </h3>
              <p className="text-sm text-slate-600 max-w-md">
                {isGenerating
                  ? "Analyzing performance, accessibility, best practices, and SEO. This may take a few moments..."
                  : "Get comprehensive insights about your website's performance, accessibility, SEO, and best practices."}
              </p>
            </div>
            {!isGenerating && (
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                size="lg"
                onClick={handleGenerateReport}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            )}
            {isGenerating && (
              <div className="w-full max-w-md space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Analyzing website...</span>
                  <span>Please wait</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
            )}
          </div>
        ) : (
          <ScrollArea className="h-[calc(90vh-120px)] pr-4">
            {/* Score Overview */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              {scores.map((score) => {
                const Icon = score.icon;
                return (
                  <Card key={score.label} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`w-12 h-12 rounded-full ${score.bgColor} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${score.color}`} />
                        </div>
                        <div>
                          <div className={`text-3xl font-bold ${getScoreColor(score.score)}`}>
                            {score.score}
                          </div>
                          <div className="text-sm text-slate-600 mt-1">{score.label}</div>
                        </div>
                        <Progress value={score.score} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Detailed Reports */}
            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
              </TabsList>

              {/* Performance Tab */}
              <TabsContent value="performance" className="space-y-6 mt-6">
                {/* Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-emerald-600" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {performanceMetrics.map((metric) => (
                      <div key={metric.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-slate-900">{metric.name}</div>
                            <div className="text-sm text-slate-600">{metric.description}</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getScoreColor(metric.score)}`}>
                              {metric.value}
                            </div>
                          </div>
                        </div>
                        <Progress value={metric.score} className="h-1.5" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-amber-600" />
                      Opportunities
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {performanceOpportunities.map((opportunity, index) => (
                      <div
                        key={index}
                        className="p-4 border-l-4 border-amber-400 bg-amber-50 rounded-r-lg"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-amber-600" />
                              <h4 className="font-semibold text-slate-900">{opportunity.title}</h4>
                              {getImpactBadge(opportunity.impact)}
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{opportunity.description}</p>
                            {opportunity.element && (
                              <p className="text-xs text-slate-600 font-medium">{opportunity.element}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Accessibility Tab */}
              <TabsContent value="accessibility" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="w-5 h-5 text-blue-600" />
                      Accessibility Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {accessibilityIssues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-4 border-l-4 rounded-r-lg ${
                          issue.impact === "high"
                            ? "border-red-400 bg-red-50"
                            : "border-amber-400 bg-amber-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <XCircle
                                className={`w-4 h-4 ${
                                  issue.impact === "high" ? "text-red-600" : "text-amber-600"
                                }`}
                              />
                              <h4 className="font-semibold text-slate-900">{issue.title}</h4>
                              {getImpactBadge(issue.impact)}
                            </div>
                            <p className="text-sm text-slate-700 mb-2">{issue.description}</p>
                            {issue.element && (
                              <p className="text-xs text-slate-600 font-medium">{issue.element}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="p-4 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Passed Audits</h4>
                          <ul className="text-sm text-slate-700 space-y-1">
                            <li>• Document has a valid lang attribute</li>
                            <li>• Form elements have associated labels</li>
                            <li>• Links have a discernible name</li>
                            <li>• [aria-*] attributes are valid</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-emerald-600" />
                      SEO Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-2">Passed Audits</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2"></div>
                              <div>
                                <div className="font-medium text-slate-900">Document has a meta description</div>
                                <div className="text-sm text-slate-600">Meta descriptions help search engines understand your content</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2"></div>
                              <div>
                                <div className="font-medium text-slate-900">Page has successful HTTP status code</div>
                                <div className="text-sm text-slate-600">Pages with unsuccessful status codes may not be indexed properly</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2"></div>
                              <div>
                                <div className="font-medium text-slate-900">Links are crawlable</div>
                                <div className="text-sm text-slate-600">Search engines can follow all links on your page</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2"></div>
                              <div>
                                <div className="font-medium text-slate-900">Robots.txt is valid</div>
                                <div className="text-sm text-slate-600">Properly configured robots.txt allows search engine crawling</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2"></div>
                              <div>
                                <div className="font-medium text-slate-900">Document uses legible font sizes</div>
                                <div className="text-sm text-slate-600">Font sizes are large enough for mobile devices</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card className="border-2 border-emerald-200 bg-emerald-50">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <Smartphone className="w-8 h-8 text-emerald-600" />
                            <div>
                              <div className="text-2xl font-bold text-emerald-600">Yes</div>
                              <div className="text-sm text-slate-700">Mobile Friendly</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-emerald-200 bg-emerald-50">
                        <CardContent className="pt-6">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-emerald-600" />
                            <div>
                              <div className="text-2xl font-bold text-emerald-600">Valid</div>
                              <div className="text-sm text-slate-700">Structured Data</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Best Practices Tab */}
              <TabsContent value="best-practices" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-600" />
                      Best Practices
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border-l-4 border-emerald-400 bg-emerald-50 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 mb-2">Passed Checks</h4>
                          <div className="space-y-2 text-sm text-slate-700">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              <span>Uses HTTPS</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4" />
                              <span>No browser errors in console</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Image className="w-4 h-4" />
                              <span>Images displayed with correct aspect ratio</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span>Properly sized images</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
                      <div className="flex items-start gap-2">
                        <Eye className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1">Recommendation</h4>
                          <p className="text-sm text-slate-700">
                            Consider implementing a Content Security Policy to prevent cross-site scripting attacks
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}