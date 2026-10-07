import { NotificationsCard } from "./notifications-card"
import { ProfileInfoCard } from "./profile-info-card"
import { SecurityCard } from "./security-card"

export function ProfileTab() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileInfoCard />
      <NotificationsCard />
      <SecurityCard />
    </div>
  )
}
