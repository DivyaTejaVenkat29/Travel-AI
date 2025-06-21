"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  MessageCircle,
  MapPin,
  Settings,
  Compass,
  Heart,
  CreditCard,
  Bell,
  Search,
  Plane,
  Camera,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const mainMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Travel Chat",
    url: "/dashboard/chat",
    icon: MessageCircle,
  },
  {
    title: "Explore",
    url: "/dashboard/explore",
    icon: Search,
  },
]
  // {
  //   title: "My Trips",
  //   url: "/dashboard/trips",
  //   icon: Plane,
  //   badge: "3",
  // },
  // {
  //   title: "My Location",
  //   url: "/dashboard/location",
  //   icon: MapPin,
  // },
//]

// const personalMenuItems = [
//   {
//     title: "Notifications",
//     url: "/dashboard/notifications",
//     icon: Bell,
//     badge: "3",
//   },
//   {
//     title: "Saved Places",
//     url: "/dashboard/saved",
//     icon: Heart,
//     badge: "12",
//   },
//   {
//     title: "Memories",
//     url: "/dashboard/memories",
//     icon: Camera,
//   },
//   {
//     title: "Budget Tracker",
//     url: "/dashboard/budget",
//     icon: CreditCard,
//   },
//   {
//     title: "Profile",
//     url: "/dashboard/profile",
//     icon: User,
//   },
// ]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">TravelAI</span>
            <span className="text-xs text-muted-foreground">AI-Powered Travel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-10 px-3 hover:bg-accent/50 transition-colors"
                  >
                    <Link href={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {/* {item.badge && (
                        <Badge variant="secondary" className="h-5 px-2 text-xs">
                          {item.badge}
                        </Badge>
                      )} */}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        </SidebarContent>
        {/* <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Personal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {personalMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="h-10 px-3 hover:bg-accent/50 transition-colors"
                  >
                    <Link href={item.url} className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{item.title}</span>
                      </div>
                      {item.badge && (
                        <Badge variant="outline" className="h-5 px-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent> */}

      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard/settings"}
              className="h-10 px-3 hover:bg-accent/50 transition-colors"
            >
              <Link href="/dashboard/settings" className="flex items-center space-x-3">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

       
      </SidebarFooter>
    </Sidebar>
  )
}
