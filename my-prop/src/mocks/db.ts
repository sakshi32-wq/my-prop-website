// In-memory tables behind the stateful mock handlers. Rows are copied on the
// way in and out, so callers can't mutate the store by accident.
import type { Lead } from "@/api/generated/model"
import { DEMO_LEADS } from "@/components/leads/data"

function createTable<TRow extends { id: string }>(seed: () => Array<TRow>) {
  let rows = seed().map((row) => structuredClone(row))

  return {
    all: () => rows.map((row) => structuredClone(row)),
    find(id: string) {
      const row = rows.find((r) => r.id === id)
      return row ? structuredClone(row) : undefined
    },
    insert(row: TRow) {
      rows = [structuredClone(row), ...rows]
      return structuredClone(row)
    },
    update(id: string, patch: Partial<TRow>) {
      const current = rows.find((r) => r.id === id)
      if (!current) return undefined
      const updated = { ...current, ...structuredClone(patch), id }
      rows = rows.map((r) => (r.id === id ? updated : r))
      return structuredClone(updated)
    },
    remove(id: string) {
      const before = rows.length
      rows = rows.filter((r) => r.id !== id)
      return rows.length < before
    },
    reset() {
      rows = seed().map((row) => structuredClone(row))
    },
  }
}

export const db = {
  leads: createTable<Lead>(() => DEMO_LEADS),
  /** Restores every table to its seed data. Called after each test. */
  reset() {
    db.leads.reset()
  },
}
