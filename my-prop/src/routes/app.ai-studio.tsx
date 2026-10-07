import { createFileRoute } from "@tanstack/react-router"

import { AiStudio } from "@/components/ai-studio/ai-studio"

export const Route = createFileRoute("/app/ai-studio")({ component: AiStudio })
