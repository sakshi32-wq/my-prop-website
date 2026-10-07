import { useState } from "react";
import { 
  ArrowLeft, 
  Eye, 
  Save, 
  Globe, 
  Smartphone, 
  Monitor, 
  Sparkles,
  Plus,
  Settings as SettingsIcon,
  Layers,
  Image as ImageIcon,
  Type,
  Layout,
  Undo,
  Redo,
  GripVertical,
  Trash2,
  Copy,
  ChevronDown,
  ChevronRight,
  MousePointer,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Download,
  Grid,
  Columns,
  Rows,
  Info
} from "lucide-react";
import { Link } from "react-router";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Slider } from "../components/ui/slider";
import { Textarea } from "../components/ui/textarea";
import { EditWebsiteInfoDialog } from "../components/EditWebsiteInfoDialog";
import { toast } from "sonner";

// Types
interface Element {
  id: string;
  type: "heading" | "text" | "button" | "image" | "container";
  content?: string;
  styles?: Record<string, any>;
  children?: Element[];
}

interface Section {
  id: string;
  name: string;
  type: string;
  icon: any;
  elements: Element[];
  styles: {
    backgroundColor?: string;
    backgroundImage?: string;
    padding?: number;
    height?: number;
    textAlign?: string;
    textColor?: string;
  };
}

interface HistoryState {
  sections: Section[];
  selectedSection: string | null;
  selectedElement: string | null;
}

// Section Templates
const sectionTemplates = [
  {
    type: "hero",
    name: "Hero Banner",
    icon: Layout,
    create: () => ({
      id: `section-${Date.now()}`,
      name: "Hero Banner",
      type: "hero",
      icon: Layout,
      styles: {
        backgroundColor: "#1e293b",
        backgroundImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop",
        padding: 96,
        height: 500,
        textAlign: "center",
        textColor: "white"
      },
      elements: [
        {
          id: `elem-${Date.now()}-1`,
          type: "heading" as const,
          content: "Welcome to Luxury Living",
          styles: { fontSize: 48, fontWeight: "bold", marginBottom: 16 }
        },
        {
          id: `elem-${Date.now()}-2`,
          type: "text" as const,
          content: "Experience premium lifestyle with world-class amenities",
          styles: { fontSize: 20, marginBottom: 32, opacity: 0.9 }
        },
        {
          id: `elem-${Date.now()}-3`,
          type: "button" as const,
          content: "Schedule a Visit",
          styles: { backgroundColor: "#10b981", color: "white", padding: "12px 32px", borderRadius: 8 }
        }
      ]
    })
  },
  {
    type: "gallery",
    name: "Photo Gallery",
    icon: ImageIcon,
    create: () => ({
      id: `section-${Date.now()}`,
      name: "Photo Gallery",
      type: "gallery",
      icon: ImageIcon,
      styles: {
        backgroundColor: "#ffffff",
        padding: 80,
        textColor: "#1e293b"
      },
      elements: [
        {
          id: `elem-${Date.now()}-1`,
          type: "heading" as const,
          content: "Gallery",
          styles: { fontSize: 36, fontWeight: "bold", marginBottom: 48, textAlign: "center" }
        },
        {
          id: `elem-${Date.now()}-2`,
          type: "container" as const,
          styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
          children: [
            {
              id: `elem-${Date.now()}-3`,
              type: "image" as const,
              content: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop",
              styles: { borderRadius: 12, width: "100%", height: 250, objectFit: "cover" }
            },
            {
              id: `elem-${Date.now()}-4`,
              type: "image" as const,
              content: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
              styles: { borderRadius: 12, width: "100%", height: 250, objectFit: "cover" }
            },
            {
              id: `elem-${Date.now()}-5`,
              type: "image" as const,
              content: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=300&fit=crop",
              styles: { borderRadius: 12, width: "100%", height: 250, objectFit: "cover" }
            }
          ]
        }
      ]
    })
  },
  {
    type: "amenities",
    name: "Amenities Grid",
    icon: Grid,
    create: () => ({
      id: `section-${Date.now()}`,
      name: "Amenities",
      type: "amenities",
      icon: Grid,
      styles: {
        backgroundColor: "#f8fafc",
        padding: 80,
        textColor: "#1e293b"
      },
      elements: [
        {
          id: `elem-${Date.now()}-1`,
          type: "heading" as const,
          content: "World-Class Amenities",
          styles: { fontSize: 36, fontWeight: "bold", marginBottom: 48, textAlign: "center" }
        },
        {
          id: `elem-${Date.now()}-2`,
          type: "container" as const,
          styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 },
          children: Array.from({ length: 6 }, (_, i) => ({
            id: `elem-${Date.now()}-${i + 3}`,
            type: "container" as const,
            styles: { 
              padding: 32, 
              backgroundColor: "white", 
              borderRadius: 12, 
              textAlign: "center",
              border: "2px solid #e2e8f0"
            },
            children: [
              {
                id: `elem-${Date.now()}-${i + 3}-text`,
                type: "text" as const,
                content: ["Swimming Pool", "Fitness Center", "Garden", "Parking", "Security", "Club House"][i],
                styles: { fontSize: 18, fontWeight: 600 }
              }
            ]
          }))
        }
      ]
    })
  },
  {
    type: "pricing",
    name: "Pricing Table",
    icon: Columns,
    create: () => ({
      id: `section-${Date.now()}`,
      name: "Pricing",
      type: "pricing",
      icon: Columns,
      styles: {
        backgroundColor: "#ffffff",
        padding: 80,
        textColor: "#1e293b"
      },
      elements: [
        {
          id: `elem-${Date.now()}-1`,
          type: "heading" as const,
          content: "Choose Your Dream Home",
          styles: { fontSize: 36, fontWeight: "bold", marginBottom: 48, textAlign: "center" }
        },
        {
          id: `elem-${Date.now()}-2`,
          type: "container" as const,
          styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, maxWidth: 1200, margin: "0 auto" },
          children: ["2 BHK", "3 BHK", "4 BHK"].map((type, i) => ({
            id: `elem-${Date.now()}-${i + 3}`,
            type: "container" as const,
            styles: { 
              padding: 40, 
              backgroundColor: i === 1 ? "#10b981" : "white",
              color: i === 1 ? "white" : "#1e293b",
              borderRadius: 16,
              border: i === 1 ? "none" : "2px solid #e2e8f0",
              boxShadow: i === 1 ? "0 20px 40px rgba(16, 185, 129, 0.3)" : "none"
            },
            children: [
              {
                id: `elem-${Date.now()}-${i + 3}-title`,
                type: "heading" as const,
                content: type,
                styles: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" }
              },
              {
                id: `elem-${Date.now()}-${i + 3}-price`,
                type: "text" as const,
                content: `₹${[85, 1.2, 1.8][i]} ${[85, 1.2, 1.8][i] < 10 ? "Lakhs" : "Cr"}`,
                styles: { fontSize: 36, fontWeight: "bold", marginBottom: 24, textAlign: "center" }
              },
              {
                id: `elem-${Date.now()}-${i + 3}-features`,
                type: "text" as const,
                content: `${[850, 1200, 1800][i]} sq.ft • ${i + 2} Bedrooms • ${i + 2} Bathrooms`,
                styles: { fontSize: 14, marginBottom: 24, textAlign: "center", opacity: 0.8 }
              },
              {
                id: `elem-${Date.now()}-${i + 3}-btn`,
                type: "button" as const,
                content: "View Details",
                styles: { 
                  backgroundColor: i === 1 ? "white" : "#10b981",
                  color: i === 1 ? "#10b981" : "white",
                  padding: "12px 32px",
                  borderRadius: 8,
                  width: "100%",
                  textAlign: "center"
                }
              }
            ]
          }))
        }
      ]
    })
  },
  {
    type: "contact",
    name: "Contact Form",
    icon: Type,
    create: () => ({
      id: `section-${Date.now()}`,
      name: "Contact Form",
      type: "contact",
      icon: Type,
      styles: {
        backgroundColor: "#0f172a",
        padding: 80,
        textColor: "white"
      },
      elements: [
        {
          id: `elem-${Date.now()}-1`,
          type: "heading" as const,
          content: "Get in Touch",
          styles: { fontSize: 36, fontWeight: "bold", marginBottom: 16, textAlign: "center" }
        },
        {
          id: `elem-${Date.now()}-2`,
          type: "text" as const,
          content: "Schedule a site visit or request more information",
          styles: { fontSize: 18, marginBottom: 48, textAlign: "center", opacity: 0.9 }
        },
        {
          id: `elem-${Date.now()}-3`,
          type: "container" as const,
          styles: { 
            maxWidth: 600, 
            margin: "0 auto", 
            backgroundColor: "rgba(255,255,255,0.05)",
            padding: 40,
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.1)"
          },
          children: [
            {
              id: `elem-${Date.now()}-4`,
              type: "text" as const,
              content: "📧 Form fields will appear here",
              styles: { fontSize: 16, textAlign: "center", opacity: 0.7 }
            }
          ]
        }
      ]
    })
  },
  {
    type: "features",
    name: "Features Section",
    icon: Rows,
    create: () => ({
      id: `section-${Date.now()}`,
      name: "Features",
      type: "features",
      icon: Rows,
      styles: {
        backgroundColor: "#ffffff",
        padding: 80,
        textColor: "#1e293b"
      },
      elements: [
        {
          id: `elem-${Date.now()}-1`,
          type: "heading" as const,
          content: "Why Choose Us",
          styles: { fontSize: 36, fontWeight: "bold", marginBottom: 48, textAlign: "center" }
        },
        {
          id: `elem-${Date.now()}-2`,
          type: "container" as const,
          styles: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 40, maxWidth: 1000, margin: "0 auto" },
          children: Array.from({ length: 4 }, (_, i) => ({
            id: `elem-${Date.now()}-${i + 3}`,
            type: "container" as const,
            styles: { display: "flex", gap: 20 },
            children: [
              {
                id: `elem-${Date.now()}-${i + 3}-icon`,
                type: "text" as const,
                content: "✨",
                styles: { fontSize: 32 }
              },
              {
                id: `elem-${Date.now()}-${i + 3}-content`,
                type: "container" as const,
                children: [
                  {
                    id: `elem-${Date.now()}-${i + 3}-title`,
                    type: "heading" as const,
                    content: ["Prime Location", "Smart Design", "Eco-Friendly", "Easy Financing"][i],
                    styles: { fontSize: 20, fontWeight: "bold", marginBottom: 8 }
                  },
                  {
                    id: `elem-${Date.now()}-${i + 3}-desc`,
                    type: "text" as const,
                    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                    styles: { fontSize: 15, opacity: 0.7, lineHeight: 1.6 }
                  }
                ]
              }
            ]
          }))
        }
      ]
    })
  }
];

// Draggable Section Component
function DraggableSection({ 
  section, 
  index, 
  moveSection, 
  isSelected,
  onClick,
  onDelete
}: { 
  section: Section;
  index: number;
  moveSection: (dragIndex: number, hoverIndex: number) => void;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}) {
  const [{ isDragging }, drag] = useDrag({
    type: "section",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "section",
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveSection(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <div
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors group cursor-pointer ${
          isSelected
            ? "bg-emerald-50 text-emerald-700"
            : "text-slate-700 hover:bg-slate-50"
        }`}
      >
        <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing" />
        <section.icon className="w-4 h-4" />
        <span className="text-sm font-medium flex-1">{section.name}</span>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded cursor-pointer"
        >
          <Trash2 className="w-3 h-3 text-red-600" />
        </div>
      </div>
    </div>
  );
}

// Layer Tree Component
function LayerTree({ 
  elements, 
  selectedElementId,
  onSelectElement,
  depth = 0
}: {
  elements: Element[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  depth?: number;
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "heading": return Type;
      case "text": return Type;
      case "button": return MousePointer;
      case "image": return ImageIcon;
      case "container": return Layout;
      default: return Layout;
    }
  };

  return (
    <div className="space-y-0.5">
      {elements.map((element) => {
        const Icon = getIcon(element.type);
        const hasChildren = element.children && element.children.length > 0;
        const isExpanded = expanded[element.id];
        const isSelected = selectedElementId === element.id;

        return (
          <div key={element.id}>
            <div
              onClick={() => onSelectElement(element.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors cursor-pointer ${
                isSelected
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
              {hasChildren ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(element.id);
                  }}
                  className="p-0.5 cursor-pointer"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </div>
              ) : (
                <div className="w-4" />
              )}
              <Icon className="w-3.5 h-3.5" />
              <span className="flex-1 truncate">
                {element.type === "text" || element.type === "heading" || element.type === "button"
                  ? element.content?.slice(0, 20) || element.type
                  : element.type}
              </span>
            </div>
            {hasChildren && isExpanded && element.children && (
              <LayerTree
                elements={element.children}
                selectedElementId={selectedElementId}
                onSelectElement={onSelectElement}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Main Builder Component
function WebsiteBuilderContent() {
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [sections, setSections] = useState<Section[]>([sectionTemplates[0].create()]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(sections[0]?.id || null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);
  const [editInfoOpen, setEditInfoOpen] = useState(false);

  const selectedSection = sections.find(s => s.id === selectedSectionId);

  // Find element by ID recursively
  function findElementById(element: Element, id: string | null): Element | null {
    if (!id) return null;
    if (element.id === id) return element;
    if (element.children) {
      for (const child of element.children) {
        const found = findElementById(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Get selected element
  const getSelectedElement = (): Element | null => {
    if (!selectedSection || !selectedElementId) return null;
    for (const elem of selectedSection.elements) {
      const found = findElementById(elem, selectedElementId);
      if (found) return found;
    }
    return null;
  };

  const selectedElement = getSelectedElement();

  // Save to history
  const saveToHistory = (newSections: Section[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      sections: JSON.parse(JSON.stringify(newSections)),
      selectedSection: selectedSectionId,
      selectedElement: selectedElementId
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setSections(JSON.parse(JSON.stringify(prevState.sections)));
      setSelectedSectionId(prevState.selectedSection);
      setSelectedElementId(prevState.selectedElement);
      setHistoryIndex(historyIndex - 1);
      toast.success("Undone");
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setSections(JSON.parse(JSON.stringify(nextState.sections)));
      setSelectedSectionId(nextState.selectedSection);
      setSelectedElementId(nextState.selectedElement);
      setHistoryIndex(historyIndex + 1);
      toast.success("Redone");
    }
  };

  // Move section
  const moveSection = (dragIndex: number, hoverIndex: number) => {
    const newSections = [...sections];
    const [removed] = newSections.splice(dragIndex, 1);
    newSections.splice(hoverIndex, 0, removed);
    setSections(newSections);
  };

  // Add section
  const addSection = (template: typeof sectionTemplates[0]) => {
    const newSection = template.create();
    const newSections = [...sections, newSection];
    setSections(newSections);
    setSelectedSectionId(newSection.id);
    setSelectedElementId(null);
    saveToHistory(newSections);
    toast.success(`${template.name} added`);
  };

  // Delete section
  const deleteSection = (id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    setSections(newSections);
    if (selectedSectionId === id) {
      setSelectedSectionId(newSections[0]?.id || null);
      setSelectedElementId(null);
    }
    saveToHistory(newSections);
    toast.success("Section deleted");
  };

  // Duplicate section
  const duplicateSection = () => {
    if (!selectedSection) return;
    const newSection = JSON.parse(JSON.stringify(selectedSection));
    newSection.id = `section-${Date.now()}`;
    newSection.name = `${selectedSection.name} (Copy)`;
    const newSections = [...sections, newSection];
    setSections(newSections);
    setSelectedSectionId(newSection.id);
    saveToHistory(newSections);
    toast.success("Section duplicated");
  };

  // Update section style
  const updateSectionStyle = (key: string, value: any) => {
    if (!selectedSection) return;
    const newSections = sections.map(s =>
      s.id === selectedSectionId
        ? { ...s, styles: { ...s.styles, [key]: value } }
        : s
    );
    setSections(newSections);
  };

  // Update element content or style
  const updateElement = (elementId: string, updates: Partial<Element>) => {
    if (!selectedSection) return;

    const updateElementRecursive = (elements: Element[]): Element[] => {
      return elements.map(el => {
        if (el.id === elementId) {
          return { ...el, ...updates };
        }
        if (el.children) {
          return { ...el, children: updateElementRecursive(el.children) };
        }
        return el;
      });
    };

    const newSections = sections.map(s =>
      s.id === selectedSectionId
        ? { ...s, elements: updateElementRecursive(s.elements) }
        : s
    );
    setSections(newSections);
  };

  // Render element
  const renderElement = (element: Element, sectionStyles: any): JSX.Element => {
    const isHovered = hoveredElementId === element.id;
    const isSelected = selectedElementId === element.id;
    const combinedStyles = {
      ...element.styles,
      position: "relative" as const,
      outline: isSelected ? "2px solid #10b981" : isHovered ? "2px solid #14b8a6" : "none",
      outlineOffset: "2px",
      cursor: "pointer"
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedElementId(element.id);
    };

    switch (element.type) {
      case "heading":
        return (
          <h2
            key={element.id}
            style={combinedStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoveredElementId(element.id)}
            onMouseLeave={() => setHoveredElementId(null)}
          >
            {element.content}
          </h2>
        );
      case "text":
        return (
          <p
            key={element.id}
            style={combinedStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoveredElementId(element.id)}
            onMouseLeave={() => setHoveredElementId(null)}
          >
            {element.content}
          </p>
        );
      case "button":
        return (
          <button
            key={element.id}
            style={combinedStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoveredElementId(element.id)}
            onMouseLeave={() => setHoveredElementId(null)}
          >
            {element.content}
          </button>
        );
      case "image":
        return (
          <img
            key={element.id}
            src={element.content}
            alt=""
            style={combinedStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoveredElementId(element.id)}
            onMouseLeave={() => setHoveredElementId(null)}
          />
        );
      case "container":
        return (
          <div
            key={element.id}
            style={combinedStyles}
            onClick={handleClick}
            onMouseEnter={() => setHoveredElementId(element.id)}
            onMouseLeave={() => setHoveredElementId(null)}
          >
            {element.children?.map(child => renderElement(child, sectionStyles))}
          </div>
        );
      default:
        return <div key={element.id}>Unknown element</div>;
    }
  };

  // Save
  const handleSave = () => {
    localStorage.setItem("website-builder-data", JSON.stringify(sections));
    toast.success("Website saved!");
  };

  // Export
  const handleExport = () => {
    const dataStr = JSON.stringify(sections, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "website-data.json";
    link.click();
    toast.success("Exported!");
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Link to="/app/websites">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="h-8 w-px bg-slate-200"></div>
          <div>
            <h1 className="font-bold text-slate-900">Skyline Heights</h1>
            <p className="text-xs text-slate-500">skyline-heights.myprop.live</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={historyIndex <= 0}
              className="h-8"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="h-8"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          {/* Device Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
            <Button
              variant={device === "desktop" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDevice("desktop")}
              className="h-8"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={device === "tablet" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDevice("tablet")}
              className="h-8"
            >
              <Smartphone className="w-4 h-4 rotate-90" />
            </Button>
            <Button
              variant={device === "mobile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setDevice("mobile")}
              className="h-8"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.open("/preview", "_blank")}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600">
            <Globe className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Sections & Layers */}
        <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto flex flex-col">
          <div className="p-4 flex-1">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Assist
            </Button>

            <Tabs defaultValue="sections" className="w-full">
              <TabsList className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="layers">Layers</TabsTrigger>
              </TabsList>

              <TabsContent value="sections" className="space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Page Sections
                  </h3>
                  <div className="space-y-1">
                    {sections.map((section, index) => (
                      <DraggableSection
                        key={section.id}
                        section={section}
                        index={index}
                        moveSection={moveSection}
                        isSelected={selectedSectionId === section.id}
                        onClick={() => {
                          setSelectedSectionId(section.id);
                          setSelectedElementId(null);
                        }}
                        onDelete={() => deleteSection(section.id)}
                      />
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Add Section
                  </h3>
                  <div className="space-y-1">
                    {sectionTemplates.map((template) => (
                      <button
                        key={template.type}
                        onClick={() => addSection(template)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <template.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{template.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="layers">
                {selectedSection ? (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      {selectedSection.name} Elements
                    </h3>
                    <LayerTree
                      elements={selectedSection.elements}
                      selectedElementId={selectedElementId}
                      onSelectElement={setSelectedElementId}
                    />
                  </div>
                ) : (
                  <div className="text-center text-slate-400 py-8">
                    <Layers className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Select a section to view layers</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div className="p-4 border-t border-slate-200 space-y-2">
            <Button variant="outline" size="sm" className="w-full" onClick={() => setEditInfoOpen(true)}>
              <Info className="w-4 h-4 mr-2" />
              Edit Website Info
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={duplicateSection}>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate Section
            </Button>
            <Button variant="outline" size="sm" className="w-full" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Center - Preview Canvas */}
        <div className="flex-1 bg-slate-100 overflow-auto p-8">
          <div 
            className={`mx-auto bg-white shadow-2xl transition-all duration-300 ${
              device === "desktop" ? "max-w-6xl" :
              device === "tablet" ? "max-w-2xl" :
              "max-w-sm"
            }`}
          >
            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => {
                  setSelectedSectionId(section.id);
                  setSelectedElementId(null);
                }}
                className={`relative transition-all ${
                  selectedSectionId === section.id ? "ring-4 ring-emerald-400" : ""
                }`}
                style={{
                  backgroundColor: section.styles.backgroundColor,
                  backgroundImage: section.styles.backgroundImage 
                    ? `url(${section.styles.backgroundImage})` 
                    : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  padding: `${section.styles.padding || 40}px`,
                  minHeight: section.styles.height ? `${section.styles.height}px` : "auto",
                  textAlign: section.styles.textAlign as any || "left",
                  color: section.styles.textColor || "#000000",
                }}
              >
                {selectedSectionId === section.id && (
                  <div className="absolute -top-8 left-0 bg-emerald-500 text-white px-3 py-1 rounded-t text-sm font-medium z-10">
                    {section.name}
                  </div>
                )}
                <div className={section.styles.backgroundImage ? "relative z-10" : ""}>
                  {section.elements.map(element => renderElement(element, section.styles))}
                </div>
                {section.styles.backgroundImage && (
                  <div className="absolute inset-0 bg-black opacity-40" style={{ zIndex: 1 }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-white border-l border-slate-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <SettingsIcon className="w-5 h-5 text-slate-600" />
              <h3 className="font-bold text-slate-900">Properties</h3>
            </div>

            {selectedElementId && selectedElement ? (
              // Element Properties
              <div className="space-y-4">
                <div className="pb-4 border-b border-slate-200">
                  <h4 className="font-semibold text-slate-700 mb-2">
                    Editing: {selectedElement.type}
                  </h4>
                </div>

                {(selectedElement.type === "heading" || 
                  selectedElement.type === "text" || 
                  selectedElement.type === "button") && (
                  <div>
                    <Label htmlFor="element-content">Content</Label>
                    <Textarea
                      id="element-content"
                      value={selectedElement.content || ""}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                )}

                {selectedElement.type === "image" && (
                  <div>
                    <Label htmlFor="element-image">Image URL</Label>
                    <Input
                      id="element-image"
                      value={selectedElement.content || ""}
                      onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="elem-font-size">Font Size</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="elem-font-size"
                      type="number"
                      value={selectedElement.styles?.fontSize || 16}
                      onChange={(e) => updateElement(selectedElement.id, {
                        styles: { ...selectedElement.styles, fontSize: parseInt(e.target.value) }
                      })}
                      className="flex-1"
                    />
                    <span className="text-sm text-slate-500 flex items-center">px</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="elem-font-weight">Font Weight</Label>
                  <Select
                    value={selectedElement.styles?.fontWeight?.toString() || "normal"}
                    onValueChange={(value) => updateElement(selectedElement.id, {
                      styles: { ...selectedElement.styles, fontWeight: value }
                    })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="500">Medium</SelectItem>
                      <SelectItem value="600">Semibold</SelectItem>
                      <SelectItem value="bold">Bold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="elem-margin">Margin Bottom</Label>
                  <Slider
                    id="elem-margin"
                    value={[selectedElement.styles?.marginBottom || 0]}
                    onValueChange={([value]) => updateElement(selectedElement.id, {
                      styles: { ...selectedElement.styles, marginBottom: value }
                    })}
                    max={100}
                    step={4}
                    className="mt-2"
                  />
                  <span className="text-xs text-slate-500">{selectedElement.styles?.marginBottom || 0}px</span>
                </div>

                {selectedElement.type === "button" && (
                  <>
                    <div>
                      <Label htmlFor="elem-bg-color">Background Color</Label>
                      <Input
                        id="elem-bg-color"
                        type="text"
                        value={selectedElement.styles?.backgroundColor || "#10b981"}
                        onChange={(e) => updateElement(selectedElement.id, {
                          styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="elem-text-color">Text Color</Label>
                      <Input
                        id="elem-text-color"
                        type="text"
                        value={selectedElement.styles?.color || "#ffffff"}
                        onChange={(e) => updateElement(selectedElement.id, {
                          styles: { ...selectedElement.styles, color: e.target.value }
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="elem-border-radius">Border Radius</Label>
                      <Slider
                        id="elem-border-radius"
                        value={[selectedElement.styles?.borderRadius || 8]}
                        onValueChange={([value]) => updateElement(selectedElement.id, {
                          styles: { ...selectedElement.styles, borderRadius: value }
                        })}
                        max={50}
                        step={2}
                        className="mt-2"
                      />
                      <span className="text-xs text-slate-500">{selectedElement.styles?.borderRadius || 8}px</span>
                    </div>
                  </>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => setSelectedElementId(null)}
                >
                  Deselect Element
                </Button>
              </div>
            ) : selectedSection ? (
              // Section Properties
              <Tabs defaultValue="content">
                <TabsList className="w-full grid grid-cols-2 mb-6">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="style">Style</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <div>
                    <Label htmlFor="section-name">Section Name</Label>
                    <Input
                      id="section-name"
                      value={selectedSection.name}
                      onChange={(e) => {
                        const newSections = sections.map(s =>
                          s.id === selectedSectionId ? { ...s, name: e.target.value } : s
                        );
                        setSections(newSections);
                      }}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bg-image">Background Image URL</Label>
                    <Input
                      id="bg-image"
                      value={selectedSection.styles.backgroundImage || ""}
                      onChange={(e) => updateSectionStyle("backgroundImage", e.target.value)}
                      className="mt-1"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-slate-500 mt-1">Leave empty for solid color</p>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate with AI
                  </Button>
                </TabsContent>

                <TabsContent value="style" className="space-y-4">
                  <div>
                    <Label htmlFor="bg-color">Background Color</Label>
                    <div className="flex gap-2 mt-2">
                      {["#0f172a", "#10b981", "#14b8a6", "#f59e0b", "#ffffff", "#f8fafc"].map(color => (
                        <button
                          key={color}
                          onClick={() => updateSectionStyle("backgroundColor", color)}
                          className={`w-10 h-10 rounded-lg border-2 ${
                            selectedSection.styles.backgroundColor === color
                              ? "border-slate-900"
                              : "border-slate-200"
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <Input
                      type="text"
                      value={selectedSection.styles.backgroundColor || "#ffffff"}
                      onChange={(e) => updateSectionStyle("backgroundColor", e.target.value)}
                      className="mt-2"
                      placeholder="#ffffff"
                    />
                  </div>

                  <div>
                    <Label htmlFor="text-color">Text Color</Label>
                    <Select
                      value={selectedSection.styles.textColor || "black"}
                      onValueChange={(value) => updateSectionStyle("textColor", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="#1e293b">Dark</SelectItem>
                        <SelectItem value="#64748b">Gray</SelectItem>
                        <SelectItem value="#10b981">Emerald</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="padding">Padding</Label>
                    <Slider
                      id="padding"
                      value={[selectedSection.styles.padding || 40]}
                      onValueChange={([value]) => updateSectionStyle("padding", value)}
                      max={200}
                      step={8}
                      className="mt-2"
                    />
                    <span className="text-xs text-slate-500">{selectedSection.styles.padding || 40}px</span>
                  </div>

                  <div>
                    <Label htmlFor="height">Min Height</Label>
                    <Slider
                      id="height"
                      value={[selectedSection.styles.height || 300]}
                      onValueChange={([value]) => updateSectionStyle("height", value)}
                      min={200}
                      max={800}
                      step={50}
                      className="mt-2"
                    />
                    <span className="text-xs text-slate-500">{selectedSection.styles.height || 300}px</span>
                  </div>

                  <div>
                    <Label htmlFor="text-align">Text Alignment</Label>
                    <div className="flex gap-2 mt-2">
                      {[
                        { value: "left", icon: AlignLeft },
                        { value: "center", icon: AlignCenter },
                        { value: "right", icon: AlignRight }
                      ].map(({ value, icon: Icon }) => (
                        <Button
                          key={value}
                          variant={selectedSection.styles.textAlign === value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateSectionStyle("textAlign", value)}
                          className="flex-1"
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <SettingsIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Select a section or element to edit properties</p>
              </div>
            )}

            {selectedSection && (
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    saveToHistory(sections);
                    toast.success("Changes saved to history");
                  }}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => deleteSection(selectedSection.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Section
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Website Info Dialog */}
      <EditWebsiteInfoDialog 
        open={editInfoOpen} 
        onOpenChange={setEditInfoOpen}
      />
    </div>
  );
}

export function WebsiteBuilder() {
  return (
    <DndProvider backend={HTML5Backend}>
      <WebsiteBuilderContent />
    </DndProvider>
  );
}