import { useState } from "react"
import {
  CheckIcon,
  ChevronRightIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  HistoryIcon,
  PencilLineIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { getTool } from "./data"
import type { Generation } from "./data"
import { CopyButton } from "./copy-button"
import { downloadFile, slugify } from "./utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

function generationText(item: Generation) {
  return item.content ?? item.preview
}

function downloadGeneration(item: Generation) {
  const body = [
    item.title,
    `Project: ${item.projectName}`,
    `Location: ${item.location}`,
    `Date: ${item.date}`,
    "",
    generationText(item),
    "",
  ].join("\n")
  downloadFile(`${slugify(item.title)}.txt`, body, "text/plain;charset=utf-8")
  toast.success("Download started", { description: `${item.title}.txt` })
}

function StatusBadge({ status }: { status: Generation["status"] }) {
  if (status === "draft") {
    return (
      <Badge variant="outline">
        <PencilLineIcon data-icon="inline-start" />
        Draft
      </Badge>
    )
  }
  return (
    <Badge variant="secondary">
      <CheckIcon data-icon="inline-start" />
      Completed
    </Badge>
  )
}

export function RecentGenerations({
  generations,
  onDelete,
}: {
  generations: Array<Generation>
  onDelete: (id: string) => void
}) {
  const [historyOpen, setHistoryOpen] = useState(false)
  const [viewing, setViewing] = useState<Generation | null>(null)
  const [deleting, setDeleting] = useState<Generation | null>(null)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Generations</CardTitle>
          <CardAction>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Open generation history"
              onClick={() => setHistoryOpen(true)}
            >
              <ChevronRightIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {generations.length === 0 ? (
            <Empty className="p-4">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <HistoryIcon />
                </EmptyMedia>
                <EmptyTitle>No generations yet</EmptyTitle>
                <EmptyDescription>
                  Content you generate and save will show up here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ItemGroup className="gap-2">
              {generations.slice(0, 3).map((item) => (
                <Item key={item.id} variant="outline" size="sm" asChild>
                  <button type="button" onClick={() => setViewing(item)}>
                    <ItemContent className="min-w-0 text-left">
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDescription>{item.timestamp}</ItemDescription>
                    </ItemContent>
                    <ChevronRightIcon className="size-4 text-muted-foreground" />
                  </button>
                </Item>
              ))}
            </ItemGroup>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setHistoryOpen(true)}
          >
            <ClockIcon data-icon="inline-start" />
            View All History
          </Button>
        </CardFooter>
      </Card>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent className="data-[side=right]:w-full data-[side=right]:sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Generation History</SheetTitle>
            <SheetDescription>
              View and manage all your AI-generated content
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
            {generations.length === 0 ? (
              <Empty className="border">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <HistoryIcon />
                  </EmptyMedia>
                  <EmptyTitle>No history</EmptyTitle>
                  <EmptyDescription>
                    You've deleted every generation. Generate something new to
                    get started.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              generations.map((item) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  onView={() => setViewing(item)}
                  onDelete={() => setDeleting(item)}
                />
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog
        open={viewing !== null}
        onOpenChange={(open) => {
          if (!open) setViewing(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.title}</DialogTitle>
            <DialogDescription>
              {viewing?.projectName} · {viewing?.location} · {viewing?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[50vh] overflow-y-auto rounded-lg bg-muted p-4 text-sm leading-relaxed whitespace-pre-wrap">
            {viewing ? generationText(viewing) : null}
          </div>
          {viewing && (
            <DialogFooter>
              <CopyButton
                text={generationText(viewing)}
                showLabel
                variant="outline"
                size="default"
              />
              <Button onClick={() => downloadGeneration(viewing)}>
                <DownloadIcon data-icon="inline-start" />
                Download
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleting !== null}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this generation?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleting?.title}" will be permanently removed from your history.
              This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (!deleting) return
                onDelete(deleting.id)
                toast.success("Generation deleted", {
                  description: deleting.title,
                })
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function HistoryCard({
  item,
  onView,
  onDelete,
}: {
  item: Generation
  onView: () => void
  onDelete: () => void
}) {
  const tool = getTool(item.type)
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <tool.icon className="size-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 truncate">{item.title}</span>
        </CardTitle>
        <CardDescription>{item.date}</CardDescription>
        <CardAction>
          <StatusBadge status={item.status} />
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
          <dt className="font-medium">Project:</dt>
          <dd className="text-muted-foreground">{item.projectName}</dd>
          <dt className="font-medium">Location:</dt>
          <dd className="text-muted-foreground">{item.location}</dd>
        </dl>
        <p className="line-clamp-2 rounded-lg bg-muted p-3 text-sm">
          {item.preview}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onView}>
          <EyeIcon data-icon="inline-start" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => downloadGeneration(item)}
        >
          <DownloadIcon data-icon="inline-start" />
          Download
        </Button>
        <Button
          variant="destructive"
          size="icon-sm"
          aria-label={`Delete ${item.title}`}
          onClick={onDelete}
        >
          <Trash2Icon />
        </Button>
      </CardFooter>
    </Card>
  )
}
