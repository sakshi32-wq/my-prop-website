import { CircleAlertIcon, RotateCwIcon } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

/** Error state for a failed query, with a Retry button. */
export function QueryError({
  title,
  error,
  onRetry,
  className,
}: {
  title: string
  error: Error | null
  onRetry: () => void
  className?: string
}) {
  return (
    <Alert variant="destructive" className={className}>
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {error?.message || "Something went wrong. Please try again."}
      </AlertDescription>
      <AlertAction>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RotateCwIcon data-icon="inline-start" />
          Retry
        </Button>
      </AlertAction>
    </Alert>
  )
}
