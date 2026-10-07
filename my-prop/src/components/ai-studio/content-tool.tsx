import { useEffect, useRef, useState } from "react"
import { format } from "date-fns"
import { CheckIcon, RefreshCwIcon, RotateCcwIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { generationTitle, toPlainText } from "./content"
import { EMPTY_FORM } from "./data"
import type { ContentFormData, ContentToolId, Generation } from "./data"
import { ContentForm } from "./content-form"
import { GeneratedOutput, GeneratedOutputSkeleton } from "./generated-output"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

const GENERATION_DELAY = 2000

export function ContentTool({
  tool,
  data,
  onDataChange,
  onSaveDraft,
}: {
  tool: ContentToolId
  data: ContentFormData
  onDataChange: (data: ContentFormData) => void
  onSaveDraft: (generation: Generation) => void
}) {
  const [generating, setGenerating] = useState(false)
  // Snapshot of the form at the moment Generate was pressed.
  const [result, setResult] = useState<ContentFormData | null>(null)
  const [formKey, setFormKey] = useState(0)
  const [savedVersion, setSavedVersion] = useState<number | null>(null)
  const [version, setVersion] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  function generate(snapshot: ContentFormData) {
    clearTimeout(timer.current)
    setGenerating(true)
    timer.current = setTimeout(() => {
      setResult(snapshot)
      setVersion((v) => v + 1)
      setGenerating(false)
    }, GENERATION_DELAY)
  }

  function startOver() {
    clearTimeout(timer.current)
    setGenerating(false)
    setResult(null)
    onDataChange(EMPTY_FORM)
    setFormKey((k) => k + 1)
  }

  function saveDraft() {
    if (!result) return
    if (savedVersion === version) {
      toast("Already saved", { description: "This version is in your drafts." })
      return
    }
    const content = toPlainText(tool, result)
    onSaveDraft({
      id: crypto.randomUUID(),
      title: generationTitle(tool, result.projectName),
      type: tool,
      projectName: result.projectName,
      location: result.location,
      timestamp: "Just now",
      date: format(new Date(), "MMM d, yyyy - h:mm a"),
      preview: content.slice(0, 160),
      content,
      status: "draft",
    })
    setSavedVersion(version)
    toast.success("Saved to drafts", {
      description: "You can find it under Recent Generations.",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ContentForm
        key={formKey}
        tool={tool}
        data={data}
        onChange={onDataChange}
        generating={generating}
        onGenerate={() => generate(data)}
      />

      {(generating || result) && (
        <>
          <Separator />
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 font-medium">
                {generating ? (
                  <>
                    <Spinner />
                    <span className="shimmer">Generating content...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon className="size-4 text-primary" />
                    Generated Content
                  </>
                )}
              </h3>
              {result && (
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={startOver}>
                    <RotateCcwIcon data-icon="inline-start" />
                    Start Over
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={generating}
                    onClick={() => generate(result)}
                  >
                    <RefreshCwIcon data-icon="inline-start" />
                    Regenerate
                  </Button>
                </div>
              )}
            </div>

            {generating || !result ? (
              <GeneratedOutputSkeleton />
            ) : (
              <GeneratedOutput key={version} tool={tool} data={result} />
            )}

            {result && !generating && (
              <>
                <Separator />
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="sm:flex-1"
                    onClick={() =>
                      toast.success(
                        tool === "copy"
                          ? "Copy applied to website"
                          : "Content ready to use",
                        {
                          description:
                            tool === "copy"
                              ? `${result.projectName}'s website sections were updated.`
                              : "We've added it to your campaign assets.",
                        }
                      )
                    }
                  >
                    <CheckIcon data-icon="inline-start" />
                    {tool === "copy" ? "Apply to Website" : "Use This Content"}
                  </Button>
                  <Button
                    variant="outline"
                    className="sm:flex-1"
                    onClick={saveDraft}
                  >
                    <SaveIcon data-icon="inline-start" />
                    Save to Drafts
                  </Button>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
