"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

const buttonStyles = {
  primary: "bg-sky-400 text-white hover:bg-sky-400/90 border-sky-500 border-b-4 active:border-b-0",
  primaryOutline: "bg-background dark:bg-background-800 text-sky-500 hover:bg-background-100 dark:hover:bg-background-700",
  secondary: "bg-green-500 text-white hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-0",
  secondaryOutline: "bg-background dark:bg-background-800 text-green-500 hover:bg-background-100 dark:hover:bg-background-700",
  danger: "bg-rose-500 text-white hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
  dangerOutline: "bg-background dark:bg-background-800 text-rose-500 hover:bg-background-100 dark:hover:bg-background-700",
  super: "bg-blue-500 text-white hover:bg-blue-500/90 border-blue-600 border-b-4 active:border-b-0",
};

const routes = [
  { label: "Learn", href: "/learn", iconSrc: "/learn.svg" },
  { label: "Leaderboard", href: "/leaderboard", iconSrc: "/leaderboard.svg" },
  { label: "Quests", href: "/quests", iconSrc: "/quest.svg" },
  { label: "Shop", href: "/shop", iconSrc: "/shop.svg" },
  { label: "maitre lucas", href: "#", iconSrc: "/study.svg", isModal: true }
];

const courses = [
  {
    title: "Je trace la lettre x",
    href: "https://maitrelucas.fr/lecons/je-trace-la-lettre-x/",
    description: "Description du cours 1"
  },
  {
    title: "Cours 2",
    href: "https://youtu.be/TV-leAqi8ps?si=8BvCnHwH-W1K2WJv",
    videoId: "TV-leAqi8ps",
    description: "Description du cours 2",
    isPreview: true
  }
  // Ajoute d'autres cours ici
];

export const MobileNavbar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <>
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

            if (route.isModal) {
              return (
                <button
                  key={route.label}
                  onClick={() => setOpen(true)}
                  className={cn(
                    "flex flex-col items-center px-3 py-1.5 rounded-xl transition-all duration-200",
                    "text-gray-400 hover:text-gray-200 hover:bg-card"
                  )}
                >
                  <Image
                    src={route.iconSrc}
                    alt={route.label}
                    width={28}
                    height={28}
                    className="transition-transform duration-200"
                  />
                </button>
              );
            }

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

      {/* Modal avec Headless UI - Design moderne */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-md border border-gray-200 flex flex-col z-50"
          >
            {/* Header avec image et titre */}
            <div className="px-6 py-8 flex flex-col items-center justify-center border-b border-gray-200">
              <div className="mb-6">
                <Image
                  src="/mascot.svg"
                  alt="Mascotte"
                  height={80}
                  width={80}
                  className="w-20 h-20"
                />
              </div>
              <DialogTitle as="h2" className="text-center font-bold text-2xl text-gray-900 mb-2">
                Cours - Maitre Lucas
              </DialogTitle>
              <p className="text-center text-gray-600 text-sm">
                Choisis un cours pour commencer
              </p>
            </div>

            {/* Contenu - Boutons des cours */}
            <div className="px-6 py-6 flex-grow overflow-y-auto max-h-[400px]">
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (course.isPreview && course.videoId) {
                        setSelectedVideo(course.videoId);
                        setVideoOpen(true);
                        setOpen(false);
                      } else {
                        window.open(course.href, "_blank");
                        setOpen(false);
                      }
                    }}
                    className={cn(
                      "w-full px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm",
                      index === 0 ? buttonStyles.primary : "bg-yellow-400 text-gray-900 hover:bg-yellow-400/90 border-yellow-500 border-b-4 active:border-b-0"
                    )}
                  >
                    {course.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer avec bouton fermer */}
            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={cn(
                  "w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm",
                  buttonStyles.danger
                )}
              >
                Fermer
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Modal vidéo YouTube */}
      <Dialog open={videoOpen} onClose={setVideoOpen} className="relative z-50">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all duration-500 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-500 data-enter:ease-out data-leave:duration-300 data-leave:ease-in w-full max-w-2xl border border-gray-200 flex flex-col z-50"
          >
            {/* Vidéo */}
            <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
              {selectedVideo && (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo}`}
                  title="Vidéo YouTube"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 px-6 py-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                className={cn(
                  "w-full px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 text-sm",
                  buttonStyles.danger
                )}
              >
                Fermer
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};