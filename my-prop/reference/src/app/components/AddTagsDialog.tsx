import { useState } from "react";
import { Tag, X, Save, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";

interface AddTagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: any;
  onSaveTags: (leadId: number, tags: string[]) => void;
}

const predefinedTags = [
  "Hot Lead",
  "Warm Lead",
  "Cold Lead",
  "First Time Buyer",
  "Investor",
  "NRI",
  "End User",
  "High Priority",
  "Budget Conscious",
  "Ready to Buy",
  "Needs Financing",
  "Cash Buyer",
  "1BHK",
  "2BHK",
  "3BHK",
  "4BHK",
  "Penthouse",
  "Villa",
  "Plot",
  "Commercial",
  "Follow Up Today",
  "Follow Up This Week",
  "Site Visit Scheduled",
  "Documentation Pending",
  "Negotiating Price",
  "Token Amount Paid"
];

export function AddTagsDialog({ open, onOpenChange, lead, onSaveTags }: AddTagsDialogProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(lead?.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    if (lead) {
      onSaveTags(lead.id, selectedTags);
      onOpenChange(false);
    }
  };

  const filteredTags = predefinedTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedTags.includes(tag)
  );

  if (!lead) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-emerald-600" />
            Manage Tags
          </DialogTitle>
          <DialogDescription>
            Add or remove tags for {lead.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lead Information */}
          <div className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-emerald-700">
                  {lead.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">{lead.name}</h4>
                <p className="text-sm text-slate-600">{lead.project} • {lead.budget}</p>
              </div>
            </div>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="space-y-3">
              <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Selected Tags ({selectedTags.length})
              </Label>
              <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-lg border-2 border-slate-200 min-h-[60px]">
                {selectedTags.map((tag, index) => (
                  <Badge
                    key={index}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white gap-1 px-3 py-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Add Custom Tag */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Add Custom Tag
            </Label>
            <div className="flex gap-2">
              <Input
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Enter custom tag name..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCustomTag();
                  }
                }}
              />
              <Button
                type="button"
                onClick={addCustomTag}
                variant="outline"
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Search Tags */}
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Quick Tags
            </Label>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto p-4 bg-slate-50 rounded-lg border border-slate-200">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-emerald-50 hover:border-emerald-300 transition-all px-3 py-1"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center w-full py-4">
                  {searchQuery ? "No matching tags found" : "All tags are selected"}
                </p>
              )}
            </div>
          </div>

          {/* Tag Categories Info */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-bold text-sm text-slate-700 mb-3">Tag Categories</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-medium text-slate-600 mb-1">Lead Quality:</p>
                <p className="text-slate-500">Hot, Warm, Cold, High Priority</p>
              </div>
              <div>
                <p className="font-medium text-slate-600 mb-1">Buyer Type:</p>
                <p className="text-slate-500">Investor, End User, NRI, First Time</p>
              </div>
              <div>
                <p className="font-medium text-slate-600 mb-1">Property Type:</p>
                <p className="text-slate-500">1BHK, 2BHK, 3BHK, Villa, Penthouse</p>
              </div>
              <div>
                <p className="font-medium text-slate-600 mb-1">Status:</p>
                <p className="text-slate-500">Follow Up, Site Visit, Documentation</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setSelectedTags(lead?.tags || []);
                setCustomTag("");
                setSearchQuery("");
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Tags
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
