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
    <nav
      className="
        lg:hidden fixed bottom-0 w-full z-50
        bg-background
        border-t-2 border-[#353535]
        shadow-[0_-1px_4px_rgba(0,0,0,0.6)]
      "
    >
      <div className="flex items-center justify-around h-[60px] px-2">
        {routes.map((route) => {
          const isActive = pathname === route.href;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200",
                isActive
                  ? "text-lime-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-card"
              )}
            >
              <Image
                src={route.iconSrc}
                alt={route.label}
                width={28}
                height={28}
                className={cn(
                  "transition-transform duration-200",
                  isActive && "scale-110"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};