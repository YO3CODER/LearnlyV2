import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: number;
  label?: string;
};

export const Footer = ({
  onCheck,
  status,
  disabled,
  lessonId,
  label,
}: Props) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  const buttonLabel = () => {
    if (label) return label;
    if (status === "none") return "Vérifier";
    if (status === "correct") return "Suivant →";
    if (status === "wrong") return "Réessayer";
    if (status === "completed") return "Continuer";
  };

  return (
    <footer
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 min-h-[70px] lg:min-h-[80px] transition-colors duration-300 border-t-2",
        status === "none" && "bg-background border-border",
        status === "correct" &&
          "bg-green-300 border-green-400 shadow-[0_-4px_20px_rgba(34,197,94,0.25)]",
        status === "wrong" &&
          "bg-rose-950/80 border-rose-600 shadow-[0_-4px_20px_rgba(244,63,94,0.20)]",
        status === "completed" && "bg-background border-border"
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="max-w-[1140px] h-[70px] lg:h-[80px] mx-auto flex items-center justify-between px-6 lg:px-10">

        {/* Correct */}
        {status === "correct" && (
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-green-700 flex items-center justify-center shrink-0 shadow-lg">
              <CheckCircle className="h-4 w-4 lg:h-5 lg:w-5 text-white stroke-[2.7]" />
            </div>
            <div>
              <p className="font-extrabold text-sm lg:text-base text-green-300 tracking-tight leading-none">
                Bravo !
              </p>
              <p className="text-xs font-medium text-green-200 mt-0.5">
                Continue comme ça 🔥
              </p>
            </div>
          </div>
        )}

        {/* Wrong */}
        {status === "wrong" && (
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-[#5a2e2e] flex items-center justify-center shrink-0">
              <XCircle className="h-4 w-4 lg:h-5 lg:w-5 text-red-400 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-extrabold text-sm lg:text-base text-red-400 tracking-tight leading-none">
                Réessaie.
              </p>
              <p className="text-xs font-medium text-red-300 mt-0.5">
                {label ?? "Tu peux le faire ! 💪"}
              </p>
            </div>
          </div>
        )}

        {/* Completed */}
        {status === "completed" && (
          <Button
            variant="default"
            size={isMobile ? "sm" : "sm"}
            onClick={() => (window.location.href = `/lesson/${lessonId}`)}
            className="rounded-xl font-bold border-2 border-b-4 border-slate-600 bg-slate-700 hover:bg-slate-600 text-white"
          >
            Pratiquer à nouveau
          </Button>
        )}

        {/* Bouton principal */}
        <Button
          disabled={disabled}
          onClick={onCheck}
          size={isMobile ? "sm" : "sm"}
          variant="secondary"
          className={cn(
            "ml-auto rounded-xl font-bold tracking-wide transition-all duration-200 border-2 border-b-4",
            status === "none" &&
              "bg-green-500 hover:bg-green-600 text-white border-green-600",
            status === "correct" &&
              "bg-green-500 hover:bg-green-600 text-white border-green-700 scale-105",
            status === "wrong" &&
              "bg-red-400 hover:bg-red-500 text-white opacity-70 border-red-600",
            status === "completed" &&
              "bg-green-500 hover:bg-green-600 text-white border-green-600"
          )}
        >
          {buttonLabel()}
        </Button>
      </div>
    </footer>
  );
};