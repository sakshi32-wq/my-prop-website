import { Link, useLocation } from "@tanstack/react-router"
import {
  ChartColumnIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  SendIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react"

import { LogoMark } from "@/components/logo"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Dashboard", to: "/app", icon: LayoutDashboardIcon, exact: true },
  { title: "Websites", to: "/app/websites", icon: GlobeIcon },
  { title: "Leads", to: "/app/leads", icon: UsersIcon },
  { title: "Campaigns", to: "/app/campaigns", icon: SendIcon },
  { title: "AI Studio", to: "/app/ai-studio", icon: SparklesIcon },
  { title: "Analytics", to: "/app/analytics", icon: ChartColumnIcon },
  { title: "Templates", to: "/app/templates", icon: LayoutTemplateIcon },
  { title: "Settings", to: "/app/settings", icon: SettingsIcon },
] as const

export function AppSidebar() {
  const { pathname } = useLocation()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/app">
                <LogoMark />
                <span className="text-lg font-semibold">myprop.live</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {navItems.map((item) => {
                const isActive =
                  "exact" in item
                    ? pathname === item.to || pathname === `${item.to}/`
                    : pathname.startsWith(item.to)
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="h-10 gap-3 text-base [&_svg]:size-5 group-data-[collapsible=icon]:[&_svg]:size-4"
                    >
                      <Link to={item.to} onClick={() => setOpenMobile(false)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
