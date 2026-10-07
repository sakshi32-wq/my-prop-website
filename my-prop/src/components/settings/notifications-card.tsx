import { Fragment } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { NOTIFICATION_OPTIONS } from "./account-data"
import { optimisticNotificationPreferences } from "./account-optimistic"
import {
  useGetNotificationPreferences,
  useUpdateNotificationPreferences,
} from "@/api/generated/account/account"
import { QueryError } from "@/components/query-error"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"

export function NotificationsCard() {
  const queryClient = useQueryClient()
  const preferencesQuery = useGetNotificationPreferences()
  const updatePreferences = useUpdateNotificationPreferences({
    mutation: {
      ...optimisticNotificationPreferences(queryClient),
      onSuccess: (preferences, { data }) => {
        const option = NOTIFICATION_OPTIONS.find((o) => o.id in data)
        if (option)
          toast.success(
            `${option.label} ${preferences[option.id] ? "enabled" : "disabled"}`
          )
      },
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose which updates you want to hear about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {preferencesQuery.isPending ? (
          <div
            className="flex flex-col gap-4"
            aria-busy="true"
            aria-label="Loading notification preferences"
          >
            {NOTIFICATION_OPTIONS.map((option) => (
              <Skeleton key={option.id} className="h-12 w-full" />
            ))}
          </div>
        ) : preferencesQuery.isError ? (
          <QueryError
            title="Couldn't load your preferences"
            error={preferencesQuery.error}
            onRetry={() => void preferencesQuery.refetch()}
          />
        ) : (
          <FieldGroup>
            {NOTIFICATION_OPTIONS.map((pref, index) => (
              <Fragment key={pref.id}>
                {index > 0 && <FieldSeparator />}
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldLabel htmlFor={`notify-${pref.id}`}>
                      {pref.label}
                    </FieldLabel>
                    <FieldDescription>{pref.description}</FieldDescription>
                  </FieldContent>
                  <Switch
                    id={`notify-${pref.id}`}
                    checked={preferencesQuery.data[pref.id]}
                    onCheckedChange={(checked) =>
                      updatePreferences.mutate({
                        data: { [pref.id]: checked },
                      })
                    }
                  />
                </Field>
              </Fragment>
            ))}
          </FieldGroup>
        )}
      </CardContent>
    </Card>
  )
}
