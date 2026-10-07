import { useNavigate } from "@tanstack/react-router"
import { GlobeIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export function WebsiteTool() {
  const navigate = useNavigate()

  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GlobeIcon />
        </EmptyMedia>
        <EmptyTitle>Generate Full Website with AI</EmptyTitle>
        <EmptyDescription>
          Create a complete property website with all sections, content, and
          layouts powered by AI
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          size="lg"
          onClick={() => {
            toast("Opening Websites", {
              description:
                "Click “Create New Website” to launch the AI website wizard.",
            })
            void navigate({ to: "/app/websites" })
          }}
        >
          <SparklesIcon data-icon="inline-start" />
          Start Website Wizard
        </Button>
      </EmptyContent>
    </Empty>
  )
}
