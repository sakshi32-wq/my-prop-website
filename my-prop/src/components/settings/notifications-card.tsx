import { Fragment, useState } from "react"
import { toast } from "sonner"

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
import { Switch } from "@/components/ui/switch"

const PREFERENCES = [
  {
    id: "newLeads",
    label: "New Lead Notifications",
    description: "Get notified when you receive a new lead",
    defaultEnabled: true,
  },
  {
    id: "campaigns",
    label: "Campaign Updates",
    description: "Receive updates on your campaign performance",
    defaultEnabled: true,
  },
  {
    id: "whatsapp",
    label: "WhatsApp Replies",
    description: "Get notified when leads reply via WhatsApp",
    defaultEnabled: true,
  },
  {
    id: "weeklyReports",
    label: "Weekly Reports",
    description: "Receive weekly performance summary emails",
    defaultEnabled: false,
  },
] as const

type PreferenceId = (typeof PREFERENCES)[number]["id"]

export function NotificationsCard() {
  const [enabled, setEnabled] = useState<Record<PreferenceId, boolean>>(
    () =>
      Object.fromEntries(
        PREFERENCES.map((pref) => [pref.id, pref.defaultEnabled])
      ) as Record<PreferenceId, boolean>
  )

  function toggle(id: PreferenceId, label: string, checked: boolean) {
    setEnabled((prev) => ({ ...prev, [id]: checked }))
    toast.success(`${label} ${checked ? "enabled" : "disabled"}`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose which updates you want to hear about.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          {PREFERENCES.map((pref, index) => (
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
                  checked={enabled[pref.id]}
                  onCheckedChange={(checked) =>
                    toggle(pref.id, pref.label, checked)
                  }
                />
              </Field>
            </Fragment>
          ))}
        </FieldGroup>
      </CardContent>
    </Card>
  )
}
