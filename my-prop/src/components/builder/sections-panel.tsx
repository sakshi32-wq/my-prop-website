import {
  CopyIcon,
  DownloadIcon,
  InfoIcon,
  LayersIcon,
  PlusIcon,
  SparklesIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useBuilder } from "./builder-context"
import { LayerTree } from "./layer-tree"
import { SECTION_ICONS } from "./section-icons"
import { SECTION_TEMPLATES } from "./section-templates"
import { SortableSectionList } from "./sortable-section-list"

function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
      {children}
    </h3>
  )
}

export function SectionsPanel({
  onEditInfo,
  onExport,
}: {
  onEditInfo: () => void
  onExport: () => void
}) {
  const {
    sections,
    selection,
    selectedSection,
    select,
    addSection,
    duplicateSection,
  } = useBuilder()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          <Button
            onClick={() =>
              toast.info("AI Assist is coming soon", {
                description:
                  "Soon you'll be able to generate whole pages from your project details.",
              })
            }
          >
            <SparklesIcon data-icon="inline-start" />
            AI Assist
          </Button>

          <Tabs defaultValue="sections">
            <TabsList className="w-full">
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="layers">Layers</TabsTrigger>
            </TabsList>

            <TabsContent value="sections" className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-2">
                <PanelHeading>Page Sections</PanelHeading>
                {sections.length > 0 ? (
                  <SortableSectionList />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No sections yet. Add one below.
                  </p>
                )}
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <PanelHeading>Add Section</PanelHeading>
                <div className="flex flex-col gap-0.5">
                  {SECTION_TEMPLATES.map((template) => {
                    const Icon = SECTION_ICONS[template.icon]
                    return (
                      <Button
                        key={template.type}
                        variant="ghost"
                        className="justify-start"
                        onClick={() => addSection(template)}
                      >
                        <Icon data-icon="inline-start" />
                        {template.name}
                        <PlusIcon
                          data-icon="inline-end"
                          className="ml-auto text-muted-foreground"
                        />
                      </Button>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layers" className="flex flex-col gap-2 pt-2">
              {selectedSection ? (
                <>
                  <PanelHeading>{selectedSection.name} Elements</PanelHeading>
                  <LayerTree
                    // Remount per section so expand state starts fresh.
                    key={selectedSection.id}
                    elements={selectedSection.elements}
                    selectedElementId={selection.elementId}
                    onSelect={(id) => select(selectedSection.id, id)}
                  />
                </>
              ) : (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <LayersIcon />
                    </EmptyMedia>
                    <EmptyTitle>No section selected</EmptyTitle>
                    <EmptyDescription>
                      Select a section to view its layers.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <Separator />
      <div className="flex flex-col gap-2 p-4">
        <Button variant="outline" onClick={onEditInfo}>
          <InfoIcon data-icon="inline-start" />
          Edit Website Info
        </Button>
        <Button
          variant="outline"
          disabled={!selectedSection}
          onClick={() =>
            selectedSection && duplicateSection(selectedSection.id)
          }
        >
          <CopyIcon data-icon="inline-start" />
          Duplicate Section
        </Button>
        <Button variant="outline" onClick={onExport}>
          <DownloadIcon data-icon="inline-start" />
          Export Data
        </Button>
      </div>
    </div>
  )
}
