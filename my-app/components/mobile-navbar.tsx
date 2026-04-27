"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const routes = [
  { label: "Learn", href: "/learn", iconSrc: "/learn.svg" },
  { label: "Leaderboard", href: "/leaderboard", iconSrc: "/leaderboard.ico" },
  { label: "Quests", href: "/quests", iconSrc: "/question.svg" },
  { label: "Shop", href: "/shop", iconSrc: "/shop.ico" },
];

export const MobileNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 w-full z-50
      bg-white border-t border-slate-200 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around h-[60px] px-2">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center gap-y-1 px-3 py-1.5 rounded-xl transition-all duration-200",
                isActive
                  ? "text-blue-500"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              )}
            >
              <Image
                src={route.iconSrc}
                alt={route.label}
                width={24}
                height={24}
                className={cn(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
              <span className={cn(
                "text-[10px] font-bold tracking-wide uppercase",
                isActive ? "text-blue-500" : "text-slate-400"
              )}>
                {route.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};