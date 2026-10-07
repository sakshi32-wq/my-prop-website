import { Outlet, Link, useLocation } from "react-router";
import { 
  LayoutDashboard, 
  Globe, 
  Users, 
  Send, 
  Sparkles, 
  BarChart3, 
  LayoutTemplate, 
  Settings,
  Search,
  Bell,
  Menu,
  X,
  Check,
  Trash2,
  UserPlus,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  User,
  LogOut
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";

const navigation = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Websites", href: "/app/websites", icon: Globe },
  { name: "Leads", href: "/app/leads", icon: Users },
  { name: "Campaigns", href: "/app/campaigns", icon: Send },
  { name: "AI Studio", href: "/app/ai-studio", icon: Sparkles },
  { name: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { name: "Templates", href: "/app/templates", icon: LayoutTemplate },
  { name: "Settings", href: "/app/settings", icon: Settings },
];

// Mock notifications data
const initialNotifications = [
  {
    id: 1,
    type: "success",
    title: "New Lead Captured",
    message: "Rahul Sharma submitted an inquiry for Skyline Heights",
    time: "2 min ago",
    read: false,
    icon: UserPlus,
    color: "emerald"
  },
  {
    id: 2,
    type: "info",
    title: "Campaign Launched",
    message: "Your WhatsApp campaign 'Marina Bay Launch' is now live",
    time: "15 min ago",
    read: false,
    icon: Send,
    color: "blue"
  },
  {
    id: 3,
    type: "success",
    title: "Website Published",
    message: "Green Valley Residency website is now live",
    time: "1 hour ago",
    read: false,
    icon: Globe,
    color: "teal"
  },
  {
    id: 4,
    type: "warning",
    title: "Low Response Rate",
    message: "Your Ocean View campaign has below average engagement",
    time: "2 hours ago",
    read: true,
    icon: AlertCircle,
    color: "amber"
  },
  {
    id: 5,
    type: "info",
    title: "Message Received",
    message: "You have 3 new WhatsApp messages from leads",
    time: "3 hours ago",
    read: true,
    icon: MessageSquare,
    color: "purple"
  },
  {
    id: 6,
    type: "success",
    title: "Conversion Milestone",
    message: "Congratulations! You've reached 100 conversions this month",
    time: "5 hours ago",
    read: true,
    icon: TrendingUp,
    color: "emerald"
  },
];

export function DashboardLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const isActive = (href: string) => {
    if (href === "/app") {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-slate-200">
          {/* Logo */}
          <div className="flex items-center gap-2 h-16 px-6 border-b border-slate-200">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">myprop.live</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? "text-emerald-600" : "text-slate-500"}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">myprop.live</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${active ? "text-emerald-600" : "text-slate-500"}`} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden -ml-2 p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="flex-1 max-w-lg mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5 text-slate-600" />
                    {unreadCount > 0 && (
                      <>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] bg-emerald-500 hover:bg-emerald-600">
                          {unreadCount}
                        </Badge>
                      </>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[420px] p-0" align="end">
                  <div className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div>
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark all read
                      </Button>
                    )}
                  </div>
                  
                  <ScrollArea className="h-[450px]">
                    {notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                          <Bell className="w-8 h-8 text-slate-400" />
                        </div>
                        <h4 className="font-medium text-slate-900 mb-1">No notifications</h4>
                        <p className="text-sm text-slate-500">You're all caught up! Check back later.</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100">
                        {notifications.map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-slate-50 transition-colors ${
                                !notification.read ? 'bg-emerald-50/30' : ''
                              }`}
                            >
                              <div className="flex gap-3">
                                <div className={`w-10 h-10 bg-${notification.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                  <Icon className={`w-5 h-5 text-${notification.color}-600`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <h4 className="font-medium text-slate-900 text-sm">
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0 mt-1.5"></div>
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-600 mb-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">
                                      {notification.time}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      {!notification.read && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => markAsRead(notification.id)}
                                          className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                        >
                                          <Check className="w-3 h-3 mr-1" />
                                          Mark read
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteNotification(notification.id)}
                                        className="h-7 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </ScrollArea>

                  {notifications.length > 0 && (
                    <div className="p-3 border-t border-slate-200 bg-slate-50">
                      <Button
                        variant="ghost"
                        className="w-full text-sm text-slate-600 hover:text-slate-900"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                    <Avatar className="cursor-pointer hidden sm:flex">
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                        JD
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}