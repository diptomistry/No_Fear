"use client";
import React, { useState,useContext } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";
import { UserContext } from "@/components/UserProvider";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Logo, LogoIcon } from "@/components/dashboard/SidebarDemo";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const userContext = useContext(UserContext) as any;
  const user = userContext?.user?.user; // Access the nested user
  const userName = user?.name || "Guest";
  



  


  const handleLogout = () => {
    signOut({ callbackUrl: "/" }); // Redirect to the root route after sign out
  };

  const links = [
    {
      label: "Home",
      href: "/dashboard/home",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Itinerary",
      href: "/dashboard/Itinerary",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "budget",
      href: "/dashboard/Budget",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Vlog",
      href: "/dashboard/vlog",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Weather",
      href: "/dashboard/Weather",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Blogs",
      href: "/dashboard/blog",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Photos",
      href: "/dashboard/Photos",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      onClick: () => handleLogout(),
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        " flex flex-col md:flex-row  dark:bg-neutral-800 w-full flex-1  border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} onClick={link.onClick} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: userName,
                href: "#",
                icon: (
                  <Image
                    src={"/exp1.svg"}
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 p-4 bg-white-100 rounded-tl-2xl border border-neutral-700 overflow-y-auto ">
  {children}
</div>

    </div>
  );
};

export default DashboardLayout;
