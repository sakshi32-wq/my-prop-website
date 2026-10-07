import { Search, Star, Eye, Download, Sparkles, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useState } from "react";
import { GenerateTemplateWizard } from "../components/GenerateTemplateWizard";
import { TemplatePreviewDialog } from "../components/TemplatePreviewDialog";
import { UseTemplateDialog } from "../components/UseTemplateDialog";

const templates = [
  {
    id: 1,
    name: "Luxury Launch",
    category: "New Development",
    thumbnail: "photo-1560518883-ce09059eeffa",
    rating: 4.9,
    uses: 1234,
    isPremium: true,
    description: "Perfect for high-end property launches",
    tags: ["luxury", "modern", "premium", "launch"]
  },
  {
    id: 2,
    name: "Modern Tower",
    category: "High-Rise",
    thumbnail: "photo-1545324418-cc1a3fa10c00",
    rating: 4.8,
    uses: 987,
    isPremium: false,
    description: "Ideal for contemporary apartment complexes",
    tags: ["modern", "apartments", "urban", "tower"]
  },
  {
    id: 3,
    name: "Villa Showcase",
    category: "Villas",
    thumbnail: "photo-1512917774080-9991f1c4c750",
    rating: 4.7,
    uses: 756,
    isPremium: true,
    description: "Showcase luxury villas and independent houses",
    tags: ["luxury", "villas", "premium", "elegant"]
  },
  {
    id: 4,
    name: "Broker Profile",
    category: "Personal Brand",
    thumbnail: "photo-1486406146926-c627a92ad1ab",
    rating: 4.6,
    uses: 654,
    isPremium: false,
    description: "Build your personal real estate brand",
    tags: ["professional", "personal", "branding", "portfolio"]
  },
  {
    id: 5,
    name: "Investment Property",
    category: "Commercial",
    thumbnail: "photo-1560518883-ce09059eeffa",
    rating: 4.8,
    uses: 543,
    isPremium: true,
    description: "Attract investors with ROI focus",
    tags: ["commercial", "investment", "business", "roi"]
  },
  {
    id: 6,
    name: "Budget Homes",
    category: "Affordable",
    thumbnail: "photo-1512917774080-9991f1c4c750",
    rating: 4.5,
    uses: 432,
    isPremium: false,
    description: "Designed for affordable housing projects",
    tags: ["affordable", "budget", "housing", "family"]
  },
  {
    id: 7,
    name: "Eco Living",
    category: "Villas",
    thumbnail: "photo-1600596542815-ffad4c1539a9",
    rating: 4.9,
    uses: 890,
    isPremium: true,
    description: "Sustainable and eco-friendly properties",
    tags: ["eco-friendly", "sustainable", "green", "luxury"]
  },
  {
    id: 8,
    name: "Downtown Loft",
    category: "High-Rise",
    thumbnail: "photo-1600607687939-ce8a6c25118c",
    rating: 4.7,
    uses: 721,
    isPremium: false,
    description: "Urban loft-style apartments",
    tags: ["urban", "loft", "modern", "downtown"]
  },
];

export function Templates() {
  const [showWizard, setShowWizard] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<typeof templates[0] | null>(null);
  const [useTemplate, setUseTemplate] = useState<typeof templates[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "premium" | "free">("all");
  const [selectedCategory, setSelectedCategory] = useState("All Templates");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags from templates
  const allTags = Array.from(
    new Set(templates.flatMap(t => t.tags))
  ).sort();

  // Filter templates based on all criteria
  const filteredTemplates = templates.filter(template => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    // Price filter
    const matchesPrice = priceFilter === "all" ||
      (priceFilter === "premium" && template.isPremium) ||
      (priceFilter === "free" && !template.isPremium);

    // Category filter
    const matchesCategory = selectedCategory === "All Templates" || 
      template.category === selectedCategory;

    // Tags filter
    const matchesTags = selectedTags.length === 0 ||
      selectedTags.every(tag => template.tags.includes(tag));

    return matchesSearch && matchesPrice && matchesCategory && matchesTags;
  });

  const handleUseTemplate = (template: typeof templates[0]) => {
    setPreviewTemplate(null); // Close preview if open
    setUseTemplate(template);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setSelectedCategory("All Templates");
    setSelectedTags([]);
  };

  const activeFiltersCount = 
    (priceFilter !== "all" ? 1 : 0) +
    (selectedCategory !== "All Templates" ? 1 : 0) +
    selectedTags.length +
    (searchQuery !== "" ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Template Library</h1>
        <p className="text-slate-600 mt-1">Choose from professionally designed templates</p>
      </div>

      {/* Search and Price Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <Tabs value={priceFilter} onValueChange={(value) => setPriceFilter(value as "all" | "premium" | "free")} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="premium">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Premium
            </TabsTrigger>
            <TabsTrigger value="free">Free</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Categories</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["All Templates", "New Development", "High-Rise", "Villas", "Commercial", "Personal Brand", "Affordable"].map((category) => (
            <Button
              key={category}
              variant={category === selectedCategory ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={category === selectedCategory ? "bg-gradient-to-r from-emerald-500 to-teal-600" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-700">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} found
            </span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchQuery}"
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-600" 
                  onClick={() => setSearchQuery("")}
                />
              </Badge>
            )}
            {priceFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {priceFilter === "premium" ? "Premium only" : "Free only"}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-600" 
                  onClick={() => setPriceFilter("all")}
                />
              </Badge>
            )}
            {selectedCategory !== "All Templates" && (
              <Badge variant="secondary" className="gap-1">
                {selectedCategory}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-600" 
                  onClick={() => setSelectedCategory("All Templates")}
                />
              </Badge>
            )}
            {selectedTags.map(tag => (
              <Badge key={tag} variant="secondary" className="gap-1">
                #{tag}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-600" 
                  onClick={() => toggleTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={clearAllFilters}
            className="flex-shrink-0"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden border-2 hover:border-emerald-300 hover:shadow-xl transition-all group">
              <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/${template.thumbnail}?w=600&h=400&fit=crop`}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {template.isPremium && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-600">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => setPreviewTemplate(template)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600" onClick={() => handleUseTemplate(template)}>
                    Use Template
                  </Button>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">{template.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-emerald-50 hover:border-emerald-300"
                      onClick={() => toggleTag(tag)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium text-slate-900">{template.rating}</span>
                    </div>
                    <div className="text-sm text-slate-500">
                      {template.uses.toLocaleString()} uses
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setPreviewTemplate(template)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </Button>
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600" onClick={() => handleUseTemplate(template)}>
                    Use Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No templates found</h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={clearAllFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        </Card>
      )}

      {/* AI Template Generator */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Create Custom Template with AI</h3>
              <p className="text-slate-700 mb-4">
                Describe your ideal property website and let AI generate a custom template tailored to your needs.
              </p>
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700" onClick={() => setShowWizard(true)}>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Custom Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Template Wizard */}
      <GenerateTemplateWizard open={showWizard} onOpenChange={setShowWizard} />
      {/* Template Preview Dialog */}
      <TemplatePreviewDialog 
        open={previewTemplate !== null} 
        onOpenChange={(open) => !open && setPreviewTemplate(null)} 
        template={previewTemplate} 
        onUseTemplate={handleUseTemplate}
      />
      {/* Use Template Dialog */}
      <UseTemplateDialog 
        open={useTemplate !== null} 
        onOpenChange={(open) => !open && setUseTemplate(null)} 
        template={useTemplate} 
      />
    </div>
  );
}