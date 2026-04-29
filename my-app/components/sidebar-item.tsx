"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

type Props = {
  iconSrc: string;
  href: string;
  label?: string;
};

export const SidebarItem = ({
  iconSrc,
  href,
  label,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "sidebarOutline" : "sidebar"}
      className="justify-center h-[52px] w-full"
      asChild
    >
      <Link href={href} aria-label={label || "menu item"}>
        <Image
          src={iconSrc}
          alt={label || "icon"}
          height={28}
          width={28}
          className={active ? "scale-110 transition" : ""}
        />
      </Link>
    </Button>
  );
};