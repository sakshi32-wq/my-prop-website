import { useState } from "react"
import { MonitorIcon, SmartphoneIcon, TabletIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

import { CanvasPage } from "./canvas-page"
import type { Device, Section } from "./types"

function PreviewBody({
  sections,
  initialDevice,
}: {
  sections: Array<Section>
  initialDevice: Device
}) {
  const [device, setDevice] = useState(initialDevice)

  return (
    <>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        spacing={0}
        aria-label="Preview device"
        value={device}
        onValueChange={(value) => {
          if (value) setDevice(value as Device)
        }}
      >
        <ToggleGroupItem value="desktop" aria-label="Desktop">
          <MonitorIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="tablet" aria-label="Tablet">
          <TabletIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="mobile" aria-label="Mobile">
          <SmartphoneIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="min-h-0 overflow-auto rounded-lg bg-muted p-2 sm:p-4">
        {sections.length > 0 ? (
          <CanvasPage sections={sections} device={device} />
        ) : (
          <p className="p-8 text-center text-sm text-muted-foreground">
            Nothing to preview yet. Add a section first.
          </p>
        )}
      </div>
    </>
  )
}

export function PreviewDialog({
  open,
  onOpenChange,
  sections,
  device,
  name,
  domain,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  sections: Array<Section>
  device: Device
  name: string
  domain: string
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90svh] grid-rows-[auto_auto_minmax(0,1fr)] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Preview: {name}</DialogTitle>
          <DialogDescription>{domain}</DialogDescription>
        </DialogHeader>
        <PreviewBody sections={sections} initialDevice={device} />
      </DialogContent>
    </Dialog>
  )
}
