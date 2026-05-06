"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePracticeModal } from "@/store/use-practice-modal";

// ─── Mini TransitionScreen (fond neutre) ──────────────────────────────────────

const TransitionOverlay = ({ onNavigate }: { onNavigate: () => void }) => {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigatedRef = useRef(false);
  const DURATION = 1500;

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const pct = Math.min(((now - start) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        if (!navigatedRef.current) {
          navigatedRef.current = true;
          setTimeout(onNavigate, 80);
        }
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [onNavigate]);

  const content = (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 99999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#fbbf24",
      opacity: mounted ? 1 : 0,
      transition: "opacity 0.28s ease",
      pointerEvents: "all",
      flexDirection: "column",
      gap: 24,
    }}>
      <Image src="/heart.svg" alt="" width={80} height={80} />
      <p style={{ color: "#fff", fontWeight: 800, fontSize: 20 }}>
        Préparation...
      </p>
      <div style={{ width: 200, height: 6, backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, backgroundColor: "#fff", borderRadius: 99, willChange: "width" }} />
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

// ─── PracticeModal ────────────────────────────────────────────────────────────

export const PracticeModal = () => {
  const [isClient, setIsClient] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const { isOpen, close, lessonId } = usePracticeModal();
  const router = useRouter();

  useEffect(() => setIsClient(true), []);

  if (!isClient) return null;

  const handleConfirm = () => {
    close();
    setShowTransition(true);
  };

  const handleTransitionDone = () => {
    router.replace(`/lesson/${lessonId}`);
  };

  return (
    <>
      {showTransition && (
        <TransitionOverlay onNavigate={handleTransitionDone} />
      )}

      <Dialog open={isOpen} onOpenChange={close}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center w-full justify-center mb-5">
              <Image src="/heart.svg" alt="Cœur" height={100} width={100} />
            </div>
            <DialogTitle className="text-center font-bold text-2xl">
              Leçon de pratique
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Utilisez les leçons de pratique pour récupérer des cœurs et des points. Vous ne pouvez pas perdre de cœurs ni de points lors des leçons de pratique.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mb-4">
            <div className="flex flex-col gap-y-4 w-full">
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                onClick={handleConfirm}
              >
                J'ai compris
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};