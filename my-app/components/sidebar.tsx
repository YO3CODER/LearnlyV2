import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex h-full w-[80px] fixed left-0 top-0 flex-col items-center",
        "bg-background",
        "border-r border-border",
        "shadow-sm",
        className
      )}
    >
      {/* LOGO */}
      <Link href="/">
        <div className="h-[72px] flex items-center justify-center group cursor-pointer">
          <Image
            src="/mascot.svg"
            height={44}
            width={44}
            alt="Mascot"
            className="relative"
          />
        </div>
      </Link>

      {/* Divider */}
      <div className="w-10 h-px bg-border mb-4" />

      {/* NAVIGATION */}
      <div className="flex flex-col gap-y-1 flex-1 w-full px-2">
        <SidebarItem href="/learn"       iconSrc="/learn.svg" />
        <SidebarItem href="/leaderboard" iconSrc="/leaderboard.ico" />
        <SidebarItem href="/quests"      iconSrc="/question.svg" />
        <SidebarItem href="/shop"        iconSrc="/shop.ico" />
      </div>

      {/* THEME */}
      <div className="mb-3">
        <ThemeToggle />
      </div>

      {/* Divider */}
      <div className="w-10 h-px bg-border mb-3" />

      {/* USER */}
      <div className="mb-4 p-2 rounded-2xl bg-card border border-border flex items-center justify-center">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton />
        </ClerkLoaded>
      </div>
    </div>
  );
};