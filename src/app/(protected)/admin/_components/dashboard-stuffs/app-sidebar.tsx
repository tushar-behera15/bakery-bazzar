"use client"

import * as React from "react"
import {
  IconCategory2,
  IconInnerShadowTop,
  IconUser,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/app/(protected)/user/_components/dashboard-stuffs/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Profile",
      url: "/admin/dashboard/profile",
      icon: IconUsers,
    },
    {
      title: "Category",
      url: "/admin/dashboard/category",
      icon: IconCategory2,
    },
    {
      title: "Sellers",
      url: "/admin/dashboard/sellers",
      icon: IconUser,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/" passHref>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}
