"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useState } from "react";
import { CameraIcon } from "lucide-react";

export const EditableUserAvatar = () => {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    // Valider le type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image");
      return;
    }

    // Valider la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("La taille ne doit pas dépasser 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await user?.setProfileImage({ file });
    } catch (err) {
      setError("Erreur lors du changement de photo");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-24 h-24 group">
      {/* Photo actuelle */}
      <Image
        src={user?.imageUrl || "/default-avatar.svg"}
        alt={user?.fullName || "Profil"}
        width={96}
        height={96}
        className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-md group-hover:opacity-75 transition"
      />

      {/* Overlay au survol */}
      <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <CameraIcon className="w-6 h-6 text-white" />
      </div>

      {/* Input hidden */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        disabled={isUploading}
        className="absolute inset-0 w-24 h-24 rounded-full cursor-pointer opacity-0"
        aria-label="Changer la photo de profil"
      />

      {/* Loading */}
      {isUploading && (
        <div className="absolute inset-0 rounded-full bg-background/80 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Erreur */}
      {error && (
        <p className="absolute top-full mt-2 text-xs text-red-500 whitespace-nowrap">
          {error}
        </p>
      )}
    </div>
  );
};