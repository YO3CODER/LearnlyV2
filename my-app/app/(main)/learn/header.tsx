import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      <Link href="/courses">
        <Button variant="ghost" size="sm" className="hover:bg-card">
          <ArrowLeft className="h-5 w-5 stroke-2 text-muted-foreground" />
        </Button>
      </Link>
      <h1 className="font-bold text-lg text-foreground">
        {title}
      </h1>
    </div>
  );
};