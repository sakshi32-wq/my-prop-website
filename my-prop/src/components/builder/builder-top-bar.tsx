import { useSyncExternalStore } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowLeftIcon,
  EyeIcon,
  GlobeIcon,
  MonitorIcon,
  PanelLeftIcon,
  Redo2Icon,
  SaveIcon,
  Settings2Icon,
  SmartphoneIcon,
  TabletIcon,
  Undo2Icon,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { useBuilder } from "./builder-context"
import type { Device } from "./types"

const DEVICES: Array<{ value: Device; label: string; icon: LucideIcon }> = [
  { value: "desktop", label: "Desktop", icon: MonitorIcon },
  { value: "tablet", label: "Tablet", icon: TabletIcon },
  { value: "mobile", label: "Mobile", icon: SmartphoneIcon },
]

const subscribe = () => () => {}

function useIsMac() {
  return useSyncExternalStore(
    subscribe,
    () => /Mac|iPhone|iPad/.test(navigator.userAgent),
    () => false
  )
}

function IconAction({
  label,
  shortcut,
  icon: Icon,
  disabled,
  onClick,
}: {
  label: string
  shortcut?: Array<string>
  icon: LucideIcon
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/* Wrapper keeps the tooltip working while the button is disabled. */}
        <span tabIndex={disabled ? 0 : -1} className="inline-flex">
          <Button
            variant="ghost"
            size="icon"
            aria-label={label}
            disabled={disabled}
            onClick={onClick}
          >
            <Icon />
          </Button>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {label}
        {shortcut && (
          <KbdGroup>
            {shortcut.map((key) => (
              <Kbd key={key}>{key}</Kbd>
            ))}
          </KbdGroup>
        )}
      </TooltipContent>
    </Tooltip>
  )
}

export function BuilderTopBar({
  name,
  domain,
  dirty,
  saving = false,
  publishing = false,
  onSave,
  onPreview,
  onPublish,
  onOpenSections,
  onOpenProperties,
}: {
  name: string
  domain: string
  dirty: boolean
  saving?: boolean
  publishing?: boolean
  onSave: () => void
  onPreview: () => void
  onPublish: () => void
  onOpenSections: () => void
  onOpenProperties: () => void
}) {
  const { canUndo, canRedo, undo, redo, device, setDevice } = useBuilder()
  const mod = useIsMac() ? "⌘" : "Ctrl"

  return (
    <header className="flex h-14 shrink-0 items-center gap-1 border-b bg-background px-2 sm:gap-2 sm:px-4">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/app/websites" aria-label="Back to websites">
          <ArrowLeftIcon data-icon="inline-start" />
          <span className="hidden sm:inline">Back</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open sections panel"
        onClick={onOpenSections}
      >
        <PanelLeftIcon />
      </Button>
      <Separator orientation="vertical" className="my-3 hidden sm:block" />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex min-w-0 items-center gap-2">
          <h1 className="truncate text-sm font-semibold">{name}</h1>
          {dirty && (
            <Badge variant="outline" className="hidden md:inline-flex">
              Unsaved
            </Badge>
          )}
        </div>
        <p className="truncate text-xs text-muted-foreground">{domain}</p>
      </div>

      <div className="flex items-center">
        <IconAction
          label="Undo"
          icon={Undo2Icon}
          shortcut={[mod, "Z"]}
          disabled={!canUndo}
          onClick={undo}
        />
        <IconAction
          label="Redo"
          icon={Redo2Icon}
          shortcut={[mod, "Shift", "Z"]}
          disabled={!canRedo}
          onClick={redo}
        />
      </div>

      <Separator orientation="vertical" className="my-3 hidden md:block" />

      <ToggleGroup
        type="single"
        variant="outline"
        spacing={0}
        aria-label="Preview device"
        className="hidden md:flex"
        value={device}
        onValueChange={(value) => {
          if (value) setDevice(value as Device)
        }}
      >
        {DEVICES.map(({ value, label, icon: Icon }) => (
          <Tooltip key={value}>
            <TooltipTrigger asChild>
              <ToggleGroupItem value={value} aria-label={label}>
                <Icon />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>

      <Separator orientation="vertical" className="my-3 hidden md:block" />

      <Button
        variant="outline"
        size="sm"
        onClick={onSave}
        disabled={saving || publishing}
        aria-label="Save"
      >
        {saving ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <SaveIcon data-icon="inline-start" />
        )}
        <span className="hidden xl:inline">Save</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onPreview}
        aria-label="Preview"
      >
        <EyeIcon data-icon="inline-start" />
        <span className="hidden xl:inline">Preview</span>
      </Button>
      <Button
        size="sm"
        onClick={onPublish}
        disabled={saving || publishing}
        aria-label="Publish"
      >
        {publishing ? (
          <Spinner data-icon="inline-start" />
        ) : (
          <GlobeIcon data-icon="inline-start" />
        )}
        <span className="hidden sm:inline">Publish</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open properties panel"
        onClick={onOpenProperties}
      >
        <Settings2Icon />
      </Button>
    </header>
  )
}
