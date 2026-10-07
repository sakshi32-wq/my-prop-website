import { useState } from "react"
import { CheckIcon, RefreshCwIcon, RotateCcwIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { EMPTY_FORM } from "./data"
import type { ContentFormData, ContentToolId } from "./data"
import { ContentForm } from "./content-form"
import { GeneratedOutput, GeneratedOutputSkeleton } from "./generated-output"
import { useGenerateContent, useSaveGeneration } from "@/api/generated/ai/ai"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

export function ContentTool({
  tool,
  data,
  onDataChange,
}: {
  tool: ContentToolId
  data: ContentFormData
  onDataChange: (data: ContentFormData) => void
}) {
  const [formKey, setFormKey] = useState(0)
  // Bumped per result, so the output remounts (tabs, open FAQs) each time.
  const [version, setVersion] = useState(0)
  const [savedVersion, setSavedVersion] = useState<number | null>(null)
  const generateContent = useGenerateContent({
    mutation: { onSuccess: () => setVersion((v) => v + 1) },
  })
  const saveGeneration = useSaveGeneration({
    mutation: {
      onSuccess: () => {
        setSavedVersion(version)
        toast.success("Saved to drafts", {
          description: "You can find it under Recent Generations.",
        })
      },
    },
  })
  const generating = generateContent.isPending
  // The response, which also holds the form input it was generated from.
  const result = generating ? null : (generateContent.data ?? null)

  function generate(input: ContentFormData) {
    generateContent.mutate({ data: { tool, input } })
  }

  function startOver() {
    generateContent.reset()
    onDataChange(EMPTY_FORM)
    setFormKey((k) => k + 1)
  }

  function saveDraft() {
    if (!result) return
    if (savedVersion === version) {
      toast("Already saved", { description: "This version is in your drafts." })
      return
    }
    saveGeneration.mutate({
      data: {
        type: tool,
        title: result.title,
        projectName: result.input.projectName,
        location: result.input.location,
        content: result.plainText,
      },
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
                    onClick={() => generate(result.input)}
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
              <GeneratedOutput key={version} generation={result} />
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
                              ? `${result.input.projectName}'s website sections were updated.`
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
                    disabled={saveGeneration.isPending}
                    onClick={saveDraft}
                  >
                    {saveGeneration.isPending ? (
                      <Spinner data-icon="inline-start" />
                    ) : (
                      <SaveIcon data-icon="inline-start" />
                    )}
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
