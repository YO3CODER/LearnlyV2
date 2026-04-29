import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="
            flex items-center justify-center
            w-9 h-9 rounded-xl
            bg-card
            hover:bg-border
            transition-colors duration-200
          "
        >
          <Menu className="text-gray-300 w-5 h-5" />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="
          p-0 z-[100] w-[256px]
          border-r-2 border-border
          shadow-2xl
          bg-background
        "
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};