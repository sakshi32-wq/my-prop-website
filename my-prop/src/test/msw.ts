import type { HttpResponseResolver } from "msw"

/**
 * A resolver that holds requests until release() is called. It returns
 * nothing, so MSW then falls through to the stateful handler (or the next
 * override), which makes in-between states (optimistic, loading) assertable.
 */
export function gate() {
  let release = () => {}
  const opened = new Promise<void>((resolve) => (release = resolve))
  const resolver: HttpResponseResolver = async () => {
    await opened
  }
  return { resolver, release }
}
