import { useCallback, useReducer } from "react"

const MAX_HISTORY = 100
/** Edits with the same key inside this window collapse into one undo step. */
const COALESCE_MS = 800

type HistoryState<T> = {
  past: Array<T>
  present: T
  future: Array<T>
  lastKey: string | null
  lastAt: number
}

type HistoryAction<T> =
  | { type: "commit"; update: (value: T) => T; key?: string; at: number }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset"; value: T }

function reducer<T>(
  state: HistoryState<T>,
  action: HistoryAction<T>
): HistoryState<T> {
  switch (action.type) {
    case "commit": {
      const next = action.update(state.present)
      if (next === state.present) return state
      const coalesce =
        action.key !== undefined &&
        action.key === state.lastKey &&
        action.at - state.lastAt < COALESCE_MS
      return {
        past: coalesce
          ? state.past
          : [...state.past, state.present].slice(-MAX_HISTORY),
        present: next,
        future: [],
        lastKey: action.key ?? null,
        lastAt: action.at,
      }
    }
    case "undo": {
      const previous = state.past.at(-1)
      if (previous === undefined) return state
      return {
        past: state.past.slice(0, -1),
        present: previous,
        future: [state.present, ...state.future],
        lastKey: null,
        lastAt: 0,
      }
    }
    case "redo": {
      const [next, ...rest] = state.future
      if (next === undefined) return state
      return {
        past: [...state.past, state.present],
        present: next,
        future: rest,
        lastKey: null,
        lastAt: 0,
      }
    }
    case "reset":
      return {
        past: [],
        present: action.value,
        future: [],
        lastKey: null,
        lastAt: 0,
      }
  }
}

export function useHistory<T>(initial: () => T) {
  const [state, dispatch] = useReducer(
    reducer<T>,
    undefined,
    (): HistoryState<T> => ({
      past: [],
      present: initial(),
      future: [],
      lastKey: null,
      lastAt: 0,
    })
  )

  /**
   * Apply a change and record an undo step. Pass a `key` for continuous edits
   * (typing, sliders) so rapid changes become a single step.
   */
  const commit = useCallback((update: (value: T) => T, key?: string) => {
    dispatch({ type: "commit", update, key, at: Date.now() })
  }, [])
  const undo = useCallback(() => dispatch({ type: "undo" }), [])
  const redo = useCallback(() => dispatch({ type: "redo" }), [])
  const reset = useCallback(
    (value: T) => dispatch({ type: "reset", value }),
    []
  )

  return {
    value: state.present,
    commit,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  }
}
