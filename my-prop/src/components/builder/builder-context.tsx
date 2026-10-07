import { createContext, useContext } from "react"

import type { BuilderState } from "./use-builder-state"

const BuilderContext = createContext<BuilderState | null>(null)

export const BuilderProvider = BuilderContext.Provider

export function useBuilder() {
  const context = useContext(BuilderContext)
  if (!context) {
    throw new Error("useBuilder must be used inside <BuilderProvider>")
  }
  return context
}
