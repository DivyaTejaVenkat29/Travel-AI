"use client"

import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"

export function DashboardHeader() {
  const { unreadCount } = useNotifications()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <SidebarTrigger className="h-9 w-9" />
          {/* <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search destinations, trips..."
              className="pl-10 w-80 bg-background/50 border-border/50 focus:bg-background focus:border-border transition-colors"
            />
          </div> */}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 relative" asChild>
            <a href="/dashboard/notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
                >
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </a>
          </Button>

          <ThemeToggle />

          <Button variant="ghost" size="icon" className="h-9 w-9" asChild>
            <a href="/dashboard/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </a>
          </Button>

          <div className="ml-2">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-border hover:ring-primary/20 transition-all",
                  userButtonPopoverCard: "shadow-lg border",
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
