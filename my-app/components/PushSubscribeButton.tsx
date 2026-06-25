"use client";

import { useEffect, useState } from "react";

export const PushSubscribeButton = () => {
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

      // Enregistrer le SW s'il ne l'est pas encore
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register("/sw.js");
      }

      // Attendre qu'il soit actif
      await navigator.serviceWorker.ready;

      const existing = await reg.pushManager.getSubscription();
      if (existing) {
        setSubscribed(true);
        return;
      }

      try {
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        });

        const json = sub.toJSON();
        await fetch("/api/push/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: json.endpoint,
            keys: json.keys,
          }),
        });

        setSubscribed(true);
      } catch (err) {
        console.error("Subscribe error:", err);
      }
    };

    init();
  }, []);

  if (subscribed) {
    return (
      <p className="text-sm text-green-600 font-medium">
        Notifications activées
      </p>
    );
  }

  return null;
};