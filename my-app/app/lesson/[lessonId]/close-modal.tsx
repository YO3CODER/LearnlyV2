"use client";

import { useEffect } from "react";
import { usePracticeModal } from "@/store/use-practice-modal";

export const CloseModal = () => {
  const close = usePracticeModal((state) => state.close);

  useEffect(() => {
    close();
    return () => close(); // cleanup aussi
  }, []); // 👈 pas de dépendance pour éviter les re-renders

  return null;
};