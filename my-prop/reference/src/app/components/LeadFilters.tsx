import { useState } from "react";
import {
  Filter,
  X,
  Calendar,
  DollarSign,
  Globe,
  MessageSquare,
  Share2,
  UserPlus,
  User,
  MapPin,
  Tag as TagIcon,
  Home,
  RotateCcw
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export interface LeadFiltersType {
  sources: string[];
  budgetRanges: string[];
  configurations: string[];
  projects: string[];
  tags: string[];
  stages: string[];
  dateRange: {
    from: string;
    to: string;
  };
}

interface LeadFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: LeadFiltersType;
  onFiltersChange: (filters: LeadFiltersType) => void;
  onClearFilters: () => void;
}

const leadSources = [
  { value: "website", label: "Website", icon: Globe, color: "emerald" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare, color: "teal" },
  { value: "social", label: "Social Media", icon: Share2, color: "amber" },
  { value: "referral", label: "Referral", icon: UserPlus, color: "purple" },
  { value: "walk-in", label: "Walk-in", icon: User, color: "blue" },
];

const budgetRanges = [
  "₹40L - 60L",
  "₹60L - 80L",
  "₹80L - 1Cr",
  "₹1Cr - 1.5Cr",
  "₹1.5Cr - 2Cr",
  "₹2Cr+",
];

const configurations = [
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "5 BHK",
  "Penthouse",
  "Villa",
  "Plot"
];

const availableProjects = [
  "Skyline Heights",
  "Green Valley",
  "Marina Bay",
  "Sunset Towers",
  "Ocean View",
  "Garden Estate"
];

const availableTags = [
  "Hot Lead",
  "First Time Buyer",
  "Investor",
  "NRI",
  "End User",
  "Resale Interest",
  "Site Visit Done",
  "Follow Up Required"
];

const stages = [
  { value: "new", label: "New Lead" },
  { value: "contacted", label: "Contacted" },
  { value: "interested", label: "Interested" },
  { value: "scheduled", label: "Site Visit Scheduled" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed", label: "Closed" },
  { value: "lost", label: "Lost" },
];

export function LeadFilters({ open, onOpenChange, filters, onFiltersChange, onClearFilters }: LeadFiltersProps) {
  const toggleArrayFilter = (filterKey: keyof Omit<LeadFiltersType, 'dateRange'>, value: string) => {
    const currentArray = filters[filterKey] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    onFiltersChange({
      ...filters,
      [filterKey]: newArray
    });
  };

  const hasActiveFilters = 
    filters.sources.length > 0 ||
    filters.budgetRanges.length > 0 ||
    filters.configurations.length > 0 ||
    filters.projects.length > 0 ||
    filters.tags.length > 0 ||
    filters.stages.length > 0 ||
    filters.dateRange.from !== '' ||
    filters.dateRange.to !== '';

  const activeFilterCount = 
    filters.sources.length +
    filters.budgetRanges.length +
    filters.configurations.length +
    filters.projects.length +
    filters.tags.length +
    filters.stages.length +
    (filters.dateRange.from ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[500px] overflow-y-auto px-6">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-emerald-600" />
                Filter Leads
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFilterCount} active
                  </Badge>
                )}
              </SheetTitle>
              <SheetDescription>
                Refine your lead list with advanced filters
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6 px-1">
          {/* Lead Source Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Globe className="w-4 h-4 text-emerald-600" />
              <Label className="font-bold text-slate-900">Lead Source</Label>
            </div>
            <div className="space-y-2">
              {leadSources.map((source) => (
                <div key={source.value} className="flex items-center gap-3">
                  <Checkbox
                    id={`source-${source.value}`}
                    checked={filters.sources.includes(source.value)}
                    onCheckedChange={() => toggleArrayFilter('sources', source.value)}
                  />
                  <label
                    htmlFor={`source-${source.value}`}
                    className="flex items-center gap-2 text-sm cursor-pointer flex-1"
                  >
                    <source.icon className="w-4 h-4 text-slate-600" />
                    {source.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <Label className="font-bold text-slate-900">Budget Range</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {budgetRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => toggleArrayFilter('budgetRanges', range)}
                  className={`p-2.5 rounded-lg border text-sm transition-all ${
                    filters.budgetRanges.includes(range)
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Home className="w-4 h-4 text-teal-600" />
              <Label className="font-bold text-slate-900">Configuration</Label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {configurations.map((config) => (
                <button
                  key={config}
                  onClick={() => toggleArrayFilter('configurations', config)}
                  className={`p-2.5 rounded-lg border text-sm transition-all ${
                    filters.configurations.includes(config)
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  {config}
                </button>
              ))}
            </div>
          </div>

          {/* Project Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <MapPin className="w-4 h-4 text-rose-600" />
              <Label className="font-bold text-slate-900">Project</Label>
            </div>
            <div className="space-y-2">
              {availableProjects.map((project) => (
                <div key={project} className="flex items-center gap-3">
                  <Checkbox
                    id={`project-${project}`}
                    checked={filters.projects.includes(project)}
                    onCheckedChange={() => toggleArrayFilter('projects', project)}
                  />
                  <label
                    htmlFor={`project-${project}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {project}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Stage Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Filter className="w-4 h-4 text-purple-600" />
              <Label className="font-bold text-slate-900">Pipeline Stage</Label>
            </div>
            <div className="space-y-2">
              {stages.map((stage) => (
                <div key={stage.value} className="flex items-center gap-3">
                  <Checkbox
                    id={`stage-${stage.value}`}
                    checked={filters.stages.includes(stage.value)}
                    onCheckedChange={() => toggleArrayFilter('stages', stage.value)}
                  />
                  <label
                    htmlFor={`stage-${stage.value}`}
                    className="text-sm cursor-pointer flex-1"
                  >
                    {stage.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <TagIcon className="w-4 h-4 text-blue-600" />
              <Label className="font-bold text-slate-900">Tags</Label>
            </div>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleArrayFilter('tags', tag)}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                    filters.tags.includes(tag)
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 font-medium"
                      : "border-slate-200 hover:border-slate-300 text-slate-700"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <Label className="font-bold text-slate-900">Date Added</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="dateFrom" className="text-xs text-slate-600">From</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateRange.from}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, from: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dateTo" className="text-xs text-slate-600">To</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateRange.to}
                  onChange={(e) => onFiltersChange({
                    ...filters,
                    dateRange: { ...filters.dateRange, to: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white pt-6 pb-4 mt-6 border-t border-slate-200 space-y-3">
          {hasActiveFilters && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                onClearFilters();
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          )}
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            onClick={() => onOpenChange(false)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}