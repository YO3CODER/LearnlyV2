import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  return (
    <div className="flex items-center gap-x-3 py-2">
      <Link href="/courses">
        <Button variant="ghost" size="sm" className="hover:bg-background-100 dark:hover:bg-background-800 transition-colors">
          <ArrowLeft className="h-5 w-5 stroke-2 text-muted-foreground-400 hover:text-muted-foreground-500 transition-colors" />
        </Button>
      </Link>
      <h1 
        className="text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight leading-tight"
        style={{ fontFamily: "'Fredoka', sans-serif" }}
      >
        {title}
      </h1>
    </div>
  );
};