import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

export const MobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="flex items-center justify-center w-9 h-9 rounded-xl hover:bg-slate-100 transition-colors duration-200">
          <Menu className="text-slate-600 w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        className="p-0 z-[100] w-[256px] border-r-0 shadow-2xl"
        side="left"
      >
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};