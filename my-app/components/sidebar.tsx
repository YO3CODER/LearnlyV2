import Link from "next/link";
import Image from "next/image";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";

import { SidebarItem } from "./sidebar-item";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div className={cn(
      "flex h-full lg:w-[256px] lg:fixed left-0 top-0 flex-col",
      "bg-gradient-to-b from-white via-slate-50 to-blue-50/40",
      "border-r border-slate-200/80 shadow-sm",
      className,
    )}>

      {/* Logo */}
      <Link href="/">
        <div className="pt-8 px-6 pb-7 flex items-center gap-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-300/30 rounded-full blur-md scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Image src="/mascot.svg" height={52} width={52} alt="Mascot" className="relative drop-shadow-sm" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
            Learnly
          </h1>
        </div>
      </Link>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-blue-100 via-blue-100 to-transparent mb-4" />

      {/* Nav items */}
      <div className="flex flex-col gap-y-1 flex-1 px-3">
        <SidebarItem
          label="Learn"
          href="/learn"
          iconSrc="/learn.svg"
        />
        <SidebarItem
          label="Leaderboard"
          href="/leaderboard"
          iconSrc="/leaderboard.ico"
        />
        <SidebarItem
          label="Quests"
          href="/quests"
          iconSrc="/question.svg"
        />
        <SidebarItem
          label="Shop"
          href="/shop"
          iconSrc="/shop.ico"
        />
      </div>

      {/* User */}
      <div className="mx-3 mb-4 p-3 rounded-2xl bg-white/70 border border-slate-100 shadow-sm flex items-center gap-x-3">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-blue-300 animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton />
          <span className="text-sm font-medium text-slate-500">My Account</span>
        </ClerkLoaded>
      </div>

    </div>
  );
};