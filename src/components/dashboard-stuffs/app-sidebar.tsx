"use client"

import * as React from "react"
import {
  IconBox,
  IconCategory2,
  IconInnerShadowTop,
  IconMoneybag,
  IconShoppingBag,
  IconTruckDelivery,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "./nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
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
      url: "/shop/dashboard/profile",
      icon: IconUsers,
    },
    {
      title: "My shop",
      url: "/shop/dashboard/myshop",
      icon: IconShoppingBag,
    },
    {
      title: "Category",
      url: "/shop/dashboard/category",
      icon: IconCategory2,
    },
    {
      title: "Products",
      url: "/shop/dashboard/products",
      icon: IconBox,
    },
    {
      title: "Orders",
      url: "/shop/dashboard/orders",
      icon: IconTruckDelivery,
    },
    {
      title: "Payment",
      url: "/shop/dashboard/payment",
      icon: IconMoneybag,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { setOpenMobile, isMobile } = useSidebar()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/" passHref onClick={() => isMobile && setOpenMobile(false)}>
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold text-primary">Bakery Bazzar</span>
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
