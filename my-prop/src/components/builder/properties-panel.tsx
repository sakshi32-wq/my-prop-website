import { MousePointerClickIcon, Settings2Icon, Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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

import { useBuilder } from "./builder-context"
import { ElementProperties } from "./element-properties"
import { SectionProperties } from "./section-properties"

export function PropertiesPanel({
  showHeading = true,
}: {
  showHeading?: boolean
}) {
  const { selectedSection, selectedElement, deleteSection } = useBuilder()

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="flex flex-col gap-4 p-4">
          {showHeading && (
            <h2 className="flex items-center gap-2 font-medium">
              <Settings2Icon className="size-4 text-muted-foreground" />
              Properties
            </h2>
          )}

          {selectedSection && selectedElement ? (
            <ElementProperties
              key={selectedElement.id}
              sectionId={selectedSection.id}
              element={selectedElement}
            />
          ) : selectedSection ? (
            <SectionProperties
              key={selectedSection.id}
              section={selectedSection}
            />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MousePointerClickIcon />
                </EmptyMedia>
                <EmptyTitle>Nothing selected</EmptyTitle>
                <EmptyDescription>
                  Select a section or element on the canvas to edit its
                  properties.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </ScrollArea>

      {selectedSection && (
        <>
          <Separator />
          <div className="p-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2Icon data-icon="inline-start" />
                  Delete Section
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete &ldquo;{selectedSection.name}&rdquo;?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    The section and all of its elements will be removed from the
                    page. You can undo this with Ctrl+Z.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => deleteSection(selectedSection.id)}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  )
}
